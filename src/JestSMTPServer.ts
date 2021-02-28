import { ParsedMail, simpleParser } from "mailparser";
import { SMTPServer, SMTPServerOptions } from "smtp-server";

export type JestSMTPConfig = {
  port?: number;
  host?: string;
  config?: SMTPServerOptions;
};

export type JestSMTPServer = {
  mails: ParsedMail[];
  server: SMTPServer;
  resetMails: () => void;
  close: () => void;
};

const defaultConfig = {
  authMethods: ["PLAIN", "LOGIN"],
  authOptional: true,
};

export const createJestSMTPServer = (
  config: JestSMTPConfig
): JestSMTPServer => {
  const mails: ParsedMail[] = [];
  const server = new SMTPServer({
    ...defaultConfig,
    ...(config.config || {}),
    onData(stream, session, callback) {
      simpleParser(stream, {})
        .then((newMail) => {
          mails.push(newMail);
          callback();
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
  });

  const resetMails = () => {
    mails.splice(0, mails.length);
  };

  const close = () => {
    server.close();
  };

  server.listen(config.port || 465, config.host);
  return { server, mails, resetMails, close };
};
