import { FastifyRequest, FastifyInstance, FastifyPluginOptions } from "fastify";
import { APIErrorType, APIError } from "../../common/error";
import { MeilingV1OAuthOpenIDData } from "../../common/meiling/interface";
import { getTokenFromRequest } from "../../common/token";
import * as Meiling from "../../common/meiling";
import * as User from "../../common/user";
import adminHandler from "./admin";
import { sentryErrorHandler } from "../../common/sentry";

export interface FastifyRequestWithUser extends FastifyRequest {
  user: MeilingV1OAuthOpenIDData;
  isAdmin: boolean;
}

const v1Handler = (
  app: FastifyInstance,
  opts: FastifyPluginOptions,
  done: () => void
): void => {
  app.setErrorHandler(async (_err, req, rep) => {
    const err = _err as Error;

    if ((err as APIError)._isAPI) {
      const apiErr = err as APIError;

      if (apiErr.type === APIErrorType.INTERNAL_SERVER_ERROR)
        sentryErrorHandler(err, req, rep);

      return apiErr.sendFastify(rep);
    } else {
      const type: APIErrorType = _err.validation
        ? APIErrorType.INVALID_REQUEST
        : APIErrorType.INTERNAL_SERVER_ERROR;
      const error = new APIError(type);
      error.loadError(_err);

      if (type === APIErrorType.INTERNAL_SERVER_ERROR)
        sentryErrorHandler(err, req, rep);

      return error.sendFastify(rep);
    }
  });

  app.get("/", (req, rep) => {
    rep.send({
      version: 1,
    });
  });

  app.register(v1LoginRequiredHandler);
  app.register(adminHandler, { prefix: "/admin" });

  done();
};

const v1LoginRequiredHandler = (
  app: FastifyInstance,
  opts: FastifyPluginOptions,
  done: () => void
) => {
  app.decorateRequest("user", null);

  app.addHook("onRequest", async (req, rep) => {
    const token = getTokenFromRequest(req);
    if (!token) {
      throw new APIError(APIErrorType.TOKEN_NOT_FOUND, "token not found");
    }

    const data = await Meiling.getToken(token.token);
    if (!data) {
      throw new APIError(APIErrorType.INVALID_TOKEN, "token is invalid");
    }

    const permCheck = await Meiling.permCheck(
      token.token,
      config.permissions.required
    );
    if (!permCheck) {
      throw new APIError(
        APIErrorType.INSUFFICIENT_PERMISSION,
        "token does not meet with minimum sufficient permission"
      );
    }

    const user = await Meiling.getUser(token.token);
    if (!user) {
      throw new APIError(
        APIErrorType.USER_NOT_FOUND,
        "unable to load user inforamtion"
      );
    }

    (req as FastifyRequestWithUser).user = user;
    (req as FastifyRequestWithUser).isAdmin = await User.checkIsAdmin(user);

    await User.createUserIfNotExist(user);
    await User.updateLastAuthorized(user);
  });

  done();
};

export default v1Handler;
