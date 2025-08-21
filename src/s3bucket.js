/**
 * @fileoverview The S3Bucket class for managing S3 bucket operations.
 * @author Nicholas C. Zakas
 */
import { AwsClient } from "aws4fetch";

/**
 * @typedef {import("./types.js").S3BucketOptions} S3BucketOptions
 */

/**
 * Simple S3 bucket helper using aws4fetch AwsClient.
 * Constructor accepts options similar to AwsClient but 'service' is fixed to 's3'
 * and `bucket` is required.
 */
export class S3Bucket {
	/** @type {AwsClient} */
	#aws;

	/**
	 * The name of the bucket.
	 * @type {string}
	 */
	#bucket;

	/**
	 * The base URL to use for requests.
	 * @type {URL}
	 */
	#baseUrl;

	/**
	 * Whether or not to include the bucket name in the path.
	 * @type {boolean}
	 */
	#pathStyle;

	/**
	 * Create an S3Bucket helper.
	 * @param {S3BucketOptions} options Options for the S3Bucket
	 */
	constructor(options) {
		if (!options || typeof options !== "object") {
			throw new TypeError("Expected an options object.");
		}

		const {
			bucket,
			baseUrl,
			pathStyle = false,
			accessKeyId,
			secretAccessKey,
			sessionToken,
			region,
			cache,
			retries,
			initRetryMs,
		} = options;

		if (!baseUrl) {
			throw new TypeError("Expected a baseUrl.");
		}

		if (typeof baseUrl !== "string" && !(baseUrl instanceof URL)) {
			throw new TypeError("Expected a baseUrl string or URL object.");
		}

		this.#baseUrl =
			typeof baseUrl === "string" ? new URL(baseUrl) : baseUrl;
		this.#pathStyle = Boolean(pathStyle);

		/*
		 * Bucket is only required when using path-style addressing because the
		 * bucket name is included in the request path. For virtual-hosted style
		 * the bucket is assumed to be part of the hostname and therefore optional.
		 */
		if (this.#pathStyle) {
			if (!bucket || typeof bucket !== "string") {
				throw new TypeError("Expected a bucket string.");
			}
			this.#bucket = bucket;
		} else {
			/*
			 * Not path-style: bucket is optional. Store empty string when not
			 * provided to keep the private field a string.
			 */
			this.#bucket = bucket || "";
		}

		this.#aws = new AwsClient({
			accessKeyId,
			secretAccessKey,
			sessionToken,
			region,
			cache,
			retries,
			initRetryMs,
			service: "s3",
		});
	}

	/**
	 * Build an S3 URL for the given key/path.
	 * @param {string} path The object key or path
	 * @returns {string} Fully-qualified S3 URL
	 */
	#urlFor(path) {
		if (this.#pathStyle) {
			// path-style: baseUrl/<bucket>/<path>
			return new URL(
				`${encodeURIComponent(this.#bucket)}/${encodeURI(path)}`,
				this.#baseUrl,
			).href;
		}

		// virtual-hosted style (default): baseUrl/<path>
		return new URL(encodeURI(path), this.#baseUrl).href;
	}

	/**
	 * Send a HEAD request for the object at `path`.
	 * @param {string} path The object key/path
	 * @returns {Promise<Response>} The fetch Response
	 */
	async head(path) {
		const url = this.#urlFor(path);
		return this.#aws.fetch(url, { method: "HEAD" });
	}

	/**
	 * Delete the object at `path`.
	 * @param {string} path The object key/path
	 * @returns {Promise<Response>} The fetch Response
	 */
	async delete(path) {
		const url = this.#urlFor(path);
		return this.#aws.fetch(url, { method: "DELETE" });
	}

	/**
	 * Retrieve the object at `path`.
	 * @param {string} path The object key/path
	 * @returns {Promise<Response>} The fetch Response
	 */
	async get(path) {
		const url = this.#urlFor(path);
		return this.#aws.fetch(url, { method: "GET" });
	}

	/**
	 * Upload `payload` to `path` using PUT.
	 * @param {string} path The object key/path
	 * @param {BodyInit|undefined} payload The payload to upload
	 * @param {RequestInit} [opts] Additional fetch init options
	 * @returns {Promise<Response>} The fetch Response
	 */
	async put(path, payload, opts = {}) {
		const url = this.#urlFor(path);
		const init = Object.assign({ method: "PUT", body: payload }, opts);
		return this.#aws.fetch(url, init);
	}
}
