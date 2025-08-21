/**
 * @fileoverview TypeScript type definitions.
 * @author Nicholas C. Zakas
 */

/**
 * Options for creating an S3Bucket instance.
 * Matches aws4fetch AwsClient options except `service` is fixed to 's3'
 * and `bucket` is required.
 */
export type S3BucketOptions = {
	/**
	 * AWS access key ID.
	 */
	accessKeyId: string;

	/**
	 * AWS secret access key.
	 */
	secretAccessKey: string;

	/**
	 * Optional session token for temporary credentials.
	 * If provided, the client will use session-based authentication.
	 */
	sessionToken?: string;

	/**
	 * Optional AWS region. If not provided, the client will use the default region.
	 * This is useful for specifying a regional endpoint for S3.
	 */
	region?: string;

	/**
	 * Optional cache for storing credentials and other data.
	 * This can be used to improve performance by avoiding repeated authentication requests.
	 * If not provided, the client will not use any caching.
	 */
	cache?: Map<string, ArrayBuffer>;

	/**
	 * Number of retries for failed requests.
	 */
	retries?: number;

	/**
	 * Initial retry delay in milliseconds.
	 * This is the delay before the first retry attempt.
	 */
	initRetryMs?: number;

	/**
	 * The name of the S3 bucket to use. Only required when `pathStyle` is true.
	 * If `pathStyle` is false, the bucket name is assumed to be part of `baseUrl`.
	 */
	bucket?: string;

	/**
	 * The base URL for the S3 service. Basically, the full protocol and domain.
	 * For example, "https://s3.amazonaws.com" or "https://s3.us-west-2.amazonaws.com".
	 * This is used to construct the full URL for S3 requests.
	 */
	baseUrl: string | URL;

	/**
	 * Whether to use path-style addressing.
	 * If true, the bucket name will be included in the path of the URL.
	 * For example, "https://s3.amazonaws.com/bucket-name/object-key".
	 * If false, the bucket name is assumed to be part of the hostname.
	 * For example, "https://bucket-name.s3.amazonaws.com/object-key".
	 * This is useful for compatibility with older S3 clients or specific use cases.
	 */
	pathStyle?: boolean;
};
