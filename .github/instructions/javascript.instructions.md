---
applyTo: "**/*.js,**/*.ts"
---

# JavaScript/TypeScript Coding Style Guide

## Indentation

Use tabs for indentation.

## Strings

Use double quotes for strings. Example:

```typescript
// Incorrect
const message = "Hello, world!";

// Correct
const message = "Hello, world!";
```

## Conditional Statements

For conditional statements, always use indented blocks. Example:

```typescript
// Incorrect
if (condition) return;

// Correct
if (condition) {
	// do something
} else {
	// do something else
}
```

Always include one blank line before and after a conditional statement. Example:

```typescript
// Incorrect
doSomething();
if (condition) {
	// do something
}
callFunction();

// Correct
doSomething();

if (condition) {
	// do something
}

callFunction();
```

## Comments

Use single-line comments for brief explanations and multi-line comments for longer descriptions. Always start comments with a capital letter. Example:

```typescript
// Incorrect
// this is a brief comment
// this is a longer comment that explains something in detail

// Correct
// This is a brief comment
/*
 * This is a longer comment that explains something in detail.
 */
```
