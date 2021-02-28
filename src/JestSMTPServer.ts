import { ParsedMail, simpleParser } from "mailparser";
import { SMTPServer, SMTPServerOptions } from "smtp-server";

export type JestSMTPConfig = {
  port?: number;
  host?: string;
  config?: SMTPServerOptions;
};

export type JestSMTPServer = {
  emails: ParsedMail[];
  server: SMTPServer;
  resetEmails: () => void;
  close: () => void;
};

const defaultConfig = {
  authMethods: ["PLAIN", "LOGIN"],
  authOptional: true,
};

export const createJestSMTPServer = (
  config?: JestSMTPConfig
): JestSMTPServer => {
  const emails: ParsedMail[] = [];
  const server = new SMTPServer({
    ...defaultConfig,
    ...(config?.config || {}),
    onData(stream, session, callback) {
      simpleParser(stream, {})
        .then((newMail) => {
          emails.push(newMail);
          callback();
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
  });

  const resetEmails = () => {
    emails.splice(0, emails.length);
  };

  const close = () => {
    server.close();
  };

  server.listen(config?.port || 465, config?.host);
  return { server, emails, resetEmails, close };
};
