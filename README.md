# 📩 jest-smtp

This `jest` extension module provides an ad-hoc SMTP server, as well as custom jest matchers, in order to test email sendings. This is meant to use in end-to-end webserver tests.

It leverages Nodemailer's [`smtp-server`](https://nodemailer.com/extras/smtp-server/) and [`mailparser`](https://nodemailer.com/extras/mailparser/) modules.

# Installation

## Add to your project

```bash
npm i -D jest-smtp
```

## Add to jest config

In the `jest` section of your `package.json` file:

```json
"jest": {
    ...,
    "setupFilesAfterEnv": [
      "jest-smtp",
      "<rootDir>/tests/jest-setup.ts"
      ...
    ],
}
```

# Using it

## Globally

You can add `jest-smtp` globally to your `jest-setup` file.

```javascript
import { createJestSMTPServer } from 'jest-smtp';


beforeAll(() => {
    global.smtpServer = createJestSMTPServer();
})

afterAll(() => {
    global.smtpServer.close();
})

beforeEach(() => {
    global.smtpServer.resetMails();
})
```

If you use typescript you should add this declaration in your `jest.d.ts` file:

```typescript

declare namespace NodeJS {
  export interface Global {
    smtpServer: import('jest-smtp').JestSMTPServer;
  }
}
```

## In a test

```javascript
import { createJestSMTPServer } from 'jest-smtp';

describe('test my server', () => {
    const smtpServer = createJestSMTPServer();

    afterAll(() => {
        smtpServer.close();
    })

    beforeEach(() => {
        smtpServer.resetMails();
    })
})
```

# Documentation

## Jest matchers

`jest-smtp` provides custom matchers

### toHaveReceivedEmails

This tests the number of mails received by the server.

```javascript
expect(smtpServer).toHaveReceivedEmails(1);
```

### toHaveReceivedEmailMatching

This tests if an email matching the provided fields was sent. This is useful so you don't have to provide an exact match but only test the relevant fields.

The fields are structured by `mailparser`, you can find the reference here: https://nodemailer.com/extras/mailparser/#mail-object

Be especially aware that the `to`, `from`, `cc` etc... fields are structured as objects, not strings.

```javascript
expect(smtpServer).toHaveReceivedEmailMatching({
    subject: 'My e-mail subject',
    from: {
        name: 'Don\'t reply',
        address: 'noreply@myapp.com'
    }
});
```

## createJestSMTPServer

`jest-smtp` only exports one function : 

```javascript
const { emails, server, close, resetMails } = createJestSMTPServer({
    port: 465,
    host: undefined,
    options: ()
})
```

### Parameters

`port`: the port the server will be listening on. Default is 465.

`host`: the host the server will be listening on (pretty unuseful is you ask me)

`options`: these options will be passed to the `smtp-server` instance constructor. See here for reference: https://nodemailer.com/extras/smtp-server/#usage

The default options provided are :

```javascript
{
  authMethods: ["PLAIN", "LOGIN"],
  authOptional: true,
  onData: ... // if you override this function it will break the main features of the plugin
};
```

### returned objects

- `resetEmails`

convenience method to reset the list of received emails between the tests.

- `close`

shortcut to `server.close` method. This must be called after all tests or jest will timeout.

- `emails`

The list of `ParsedMail` objects received. You can access it to do extra tests on the content of the emails.

- `server`

The `smtp-server` instance.

