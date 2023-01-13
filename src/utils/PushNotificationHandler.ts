import Boom from '@hapi/boom';
import dayjs from 'dayjs';

export interface PushNotificationConfig {
  title: string;
  body: string;
  token: string;
  module?: string;
  action?: string;
  data?: { [key: string]: unknown };
  type?: string;
  image?: string;
  createdAt?: Date | string;
  clickAction?: string;
}

class PushNotificationHandler {
  public error: Error;
  public status: string;
  private readonly message: {
    data: {
      createdAt: string;
      type: string;
      payload: string;
    };
    notification: {
      title: string;
      body: string;
      image: string;
    };
    token: string;
  };

  constructor(options: PushNotificationConfig) {
    const {
      title,
      body,
      token,
      data = {},
      image = '',
      type = 'info',
    } = options;
    const createdAt = dayjs(options.createdAt).format();

    this.message = {
      data: {
        createdAt,
        type,
        payload: JSON.stringify(data),
      },
      notification: {
        title,
        body,
        image,
      },
      token,
    };
  }


  public async send(options?: { force?: boolean }): Promise<boolean | Boom.Payload> {
    const force = options?.force || true;
    const { message } = this;
    console.info('message', message);
    console.info('await for a error?', !force);
    
    return true;
  }
}

export default PushNotificationHandler;
