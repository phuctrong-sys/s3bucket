import { strict as assert } from "assert";
import { S3Bucket } from "../src/s3bucket.js";
import { MockServer, FetchMocker } from "mentoss";

describe("S3Bucket (ESM)", function () {
	const BUCKET = "my-bucket";
	const OPTIONS = {
		accessKeyId: "AKIA_TEST",
		secretAccessKey: "SECRET",
		region: "us-east-1",
		bucket: BUCKET,
	};

	it("constructor validates options object and required fields", function () {
		// no options
		assert.throws(() => new S3Bucket(), {
			name: "TypeError",
			message: "Expected an options object.",
		});

		// missing baseUrl
		assert.throws(
			() =>
				new S3Bucket({
					bucket: BUCKET,
					accessKeyId: "a",
					secretAccessKey: "b",
				}),
			{
				name: "TypeError",
				message: "Expected a baseUrl.",
			},
		);

		// baseUrl not a string or URL
		assert.throws(
			() =>
				new S3Bucket({
					bucket: BUCKET,
					baseUrl: 123,
					accessKeyId: "a",
					secretAccessKey: "b",
				}),
			{
				name: "TypeError",
				message: "Expected a baseUrl string or URL object.",
			},
		);

		// missing bucket
		assert.throws(
			() =>
				new S3Bucket({
					baseUrl: "https://s3.example.com",
					accessKeyId: "a",
					secretAccessKey: "b",
					pathStyle: true,
				}),
			{
				name: "TypeError",
				message: "Expected a bucket string.",
			},
		);
	});

	it("sends HEAD request for head()", async function () {
		const base = `https://${BUCKET}.s3.amazonaws.com`;
		const server = new MockServer(base);
		const mocker = new FetchMocker({ servers: [server] });
		mocker.mockGlobal();

		const s3 = new S3Bucket(
			Object.assign({}, OPTIONS, { baseUrl: new URL(base) }),
		);
		server.head("/some/key", 200);

		const res = await s3.head("/some/key");
		assert.equal(res.status, 200);

		// verify route was called (HEAD method)
		assert.equal(
			mocker.called({ url: `${base}/some/key`, method: "HEAD" }),
			true,
		);

		mocker.unmockGlobal();
		server.clear();
	});

	it("sends DELETE request for delete()", async function () {
		const base = `https://${BUCKET}.s3.amazonaws.com`;
		const server = new MockServer(base);
		const mocker = new FetchMocker({ servers: [server] });
		mocker.mockGlobal();

		const s3 = new S3Bucket(Object.assign({}, OPTIONS, { baseUrl: base }));
		server.delete("/obj", 204);

		const res = await s3.delete("obj");
		assert.equal(res.status, 204);

		assert.equal(
			mocker.called({ url: `${base}/obj`, method: "DELETE" }),
			true,
		);

		mocker.unmockGlobal();
		server.clear();
	});

	it("sends GET request for get()", async function () {
		const base = `https://${BUCKET}.s3.amazonaws.com/`;
		const server = new MockServer(base);
		const mocker = new FetchMocker({ servers: [server] });
		mocker.mockGlobal();

		const s3 = new S3Bucket(Object.assign({}, OPTIONS, { baseUrl: base }));
		server.get("/readme.txt", { status: 200, body: "hello" });

		const res = await s3.get("readme.txt");
		assert.equal(res.status, 200);
		const text = await res.text();
		assert.equal(text, "hello");

		assert.equal(mocker.called(`${base}readme.txt`), true);

		mocker.unmockGlobal();
		server.clear();
	});

	it("sends PUT request with payload for put()", async function () {
		const base = `https://${BUCKET}.s3.amazonaws.com`;
		const server = new MockServer(base);
		const mocker = new FetchMocker({ servers: [server] });
		mocker.mockGlobal();

		const s3 = new S3Bucket(
			Object.assign({}, OPTIONS, { baseUrl: new URL(base) }),
		);
		const payload = "abc123";
		// create a route that matches the request body and headers
		server.put(
			{
				url: "/upload.bin",
				body: payload,
				headers: { "Content-Type": "text/plain" },
			},
			200,
		);

		const res = await s3.put("upload.bin", payload, {
			headers: { "Content-Type": "text/plain" },
		});
		assert.equal(res.status, 200);

		assert.equal(
			mocker.called({
				url: `${base}/upload.bin`,
				method: "PUT",
				body: payload,
			}),
			true,
		);

		mocker.unmockGlobal();
		server.clear();
	});

	it("uses provided baseUrl (virtual-hosted) when pathStyle is false", async function () {
		const base = "https://s3.example.com";
		const server = new MockServer(base);
		const mocker = new FetchMocker({ servers: [server] });
		mocker.mockGlobal();

		const s3 = new S3Bucket(
			Object.assign({}, OPTIONS, { baseUrl: base, pathStyle: false }),
		);
		server.get("/hello.txt", { status: 200, body: "vhost" });

		const res = await s3.get("hello.txt");
		assert.equal(res.status, 200);
		const text = await res.text();
		assert.equal(text, "vhost");

		assert.equal(mocker.called(`${base}/hello.txt`), true);

		mocker.unmockGlobal();
		server.clear();
	});

	it("uses path-style baseUrl/<bucket>/<path> when pathStyle is true", async function () {
		const base = "https://s3.example.com";
		const server = new MockServer(base);
		const mocker = new FetchMocker({ servers: [server] });
		mocker.mockGlobal();

		const s3 = new S3Bucket(
			Object.assign({}, OPTIONS, { baseUrl: base, pathStyle: true }),
		);
		server.get(`/${BUCKET}/file.bin`, { status: 200, body: "pathstyle" });

		const res = await s3.get("file.bin");
		assert.equal(res.status, 200);
		const text = await res.text();
		assert.equal(text, "pathstyle");

		assert.equal(mocker.called(`${base}/${BUCKET}/file.bin`), true);

		mocker.unmockGlobal();
		server.clear();
	});
});
