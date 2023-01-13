class SMSHandler {
  public error: Error;
  public status: string;
  public async send(phoneNumber: string, message: string, options?: { force: string }): Promise<boolean | Error> {
    const force = options?.force || true;
    console.info('phoneNumber', phoneNumber);
    console.info('message', message);
    console.info('await for an error?', !force);


    return true;
  }
}

export default SMSHandler;
