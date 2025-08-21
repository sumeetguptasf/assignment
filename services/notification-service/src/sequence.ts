import {MiddlewareSequence, RequestContext} from '@loopback/rest';

export class MySequence extends MiddlewareSequence {
    async handle(context: RequestContext): Promise<void> {
    const {request, response} = context;
    try {
      // 🚀 Simply run middlewares and skip authenticate/authorize
      await this.invokeMiddleware(context);
    //   return response;
    } catch (err) {
      console.error('❌ Sequence Error:', err);

      // Write error response manually
      response.statusCode = 500;
      response.setHeader('Content-Type', 'application/json');
      response.end(
        JSON.stringify({
          error: {
            message: err.message,
            name: err.name,
          },
        }),
      );
    }
  }
}
