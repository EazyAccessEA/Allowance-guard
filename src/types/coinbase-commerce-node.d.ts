declare module 'coinbase-commerce-node' {
  export class Client {
    static init(apiKey: string): void;
    static charges: {
      create(charge: {
        name: string;
        description: string;
        local_price: {
          amount: string;
          currency: string;
        };
        pricing_type: string;
        metadata: Record<string, string>;
        redirect_url: string;
        cancel_url: string;
      }): Promise<{
        id: string;
        hosted_url: string;
        pricing: {
          local: {
            amount: string;
            currency: string;
          };
        };
        metadata: Record<string, string>;
      }>;
    };
  }

  export class WebhooksService {
    verifyEventBody(
      body: string,
      signature: string,
      secret: string
    ): {
      type: string;
      data: {
        id: string;
        pricing: {
          local: {
            amount: string;
            currency: string;
          };
        };
        metadata: Record<string, string>;
      };
    };
  }
}
