import { ParsedMail } from "mailparser";
import { JestSMTPServer } from "./JestSMTPServer";

export { createJestSMTPServer } from "./JestSMTPServer";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toHaveReceivedMails(num: number): R;
      toHaveReceivedMailMatching(email: Partial<ParsedMail>): R;
    }
  }
}

expect.extend({
  toHaveReceivedMails(received: JestSMTPServer, num: number) {
    if (received.mails.length === num) {
      return {
        message: () => `expected the server not to have received ${num} emails`,
        pass: true,
      };
    }
    return {
      message: () => `expected the server to have received ${num} emails`,

      pass: false,
    };
  },
  toHaveReceivedMailMatching(
    received: JestSMTPServer,
    email: Partial<ParsedMail>
  ) {
    const matchingMail = received.mails.find((m) => {
      let isDifferent = false;
      for (const [key, value] of Object.keys(email)) {
        if (m[key as keyof ParsedMail] !== value) {
          isDifferent = true;
        }
      }
      return isDifferent;
    });
    if (matchingMail) {
      return {
        message: () =>
          `expected the server not to have received a mail matching properties`,
        pass: true,
      };
    }
    return {
      message: () =>
        `expected the server to have received a mail matching properties`,
      pass: false,
    };
  },
});
