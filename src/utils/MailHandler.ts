

const {
  API_EMAIL_NO_REPLY,
} = process.env;

export interface MailHandlerConfig {
  email: string;
  subject: string;
  data?: { [key: string]: unknown };
}

class MailHandler {
  public error: Error;
  public status: string;
  private readonly data: { [key: string]: unknown };
  private readonly email: string;
  private readonly from: string;
  private readonly subject: string;

  constructor(options: MailHandlerConfig) {
    const { email, subject, data = {} } = options;
    this.email = email;
    this.subject = subject;
    this.from = API_EMAIL_NO_REPLY;
    this.data = data;
    
  }

  public async send(templateName: string, options?: { force?: boolean }): Promise<boolean | Error> {
    console.info(`which template to use? ${templateName}`);
    console.info('await for an error? ', !options?.force);
    // make the template of email

    return true;
  }
}

export default MailHandler;
