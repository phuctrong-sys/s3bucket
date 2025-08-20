# S3Bucket

by [Nicholas C. Zakas](https://humanwhocodes.com)

If you find this useful, please consider supporting my work with a [donation](https://humanwhocodes.com/donate).

## Description

Lightweight JavaScript helper for making signed S3 requests using aws4fetch. Provides a
small `S3Bucket` class with convenience methods for common object operations
(`head`, `get`, `put`, `delete`).

## Installation

Install from npm:

```bash
npm install @humanwhocodes/s3bucket
```

## Usage

Import and create an `S3Bucket` instance. The constructor requires a
`baseUrl` and `bucket` and accepts AWS credentials or the usual
environment-based mechanisms.

```js
import { S3Bucket } from "@humanwhocodes/s3bucket";

const s3 = new S3Bucket({
	baseUrl: "https://s3.amazonaws.com",
	bucket: "my-bucket",
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: "us-east-1", // optional
	pathStyle: true, // optional
});

// Head an object
await s3.head("path/to/object.txt");

// Get object
const res = await s3.get("path/to/object.txt");
const body = await res.text();

// Put object
await s3.put("path/to/new.txt", "hello world", {
	headers: { "Content-Type": "text/plain" },
});

// Delete object
await s3.delete("path/to/new.txt");
```

Constructor options (partial):

- `baseUrl` (string, required): Base endpoint used to build request URLs.
- `bucket` (string, required): Bucket name.
- `pathStyle` (boolean, optional, default false): When true use
  path-style URLs (`baseUrl/<bucket>/<path>`), otherwise use `baseUrl/<path>`.
- `accessKeyId`, `secretAccessKey`, `sessionToken`, `region` — forwarded to
  `aws4fetch`.

## Acknowledgements

This library is built on top of the excellent [aws4fetch](https://npmjs.com/package/aws4fetch) package.

## License

Copyright 2025 Nicholas C. Zakas

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
