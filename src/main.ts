import { ParsedMail } from "mailparser";
import { JestSMTPServer } from "./JestSMTPServer";

export {
  createJestSMTPServer,
  JestSMTPServer,
  JestSMTPConfig,
} from "./JestSMTPServer";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toHaveReceivedEmails(num: number): R;
      toHaveReceivedEmailMatching(email: Partial<ParsedMail>): R;
    }
  }
}

expect.extend({
  toHaveReceivedEmails(received: JestSMTPServer, num: number) {
    if (received.emails.length === num) {
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
  toHaveReceivedEmailMatching(
    received: JestSMTPServer,
    email: Partial<ParsedMail>
  ) {
    const matchingMail = received.emails.find((m) => {
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
