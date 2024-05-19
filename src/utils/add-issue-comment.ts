import { LogReturn } from "../adapters/supabase/helpers/logs";
import { Context } from "../types/context";

type HandlerReturnValuesNoVoid = null | string | LogReturn;

export async function addCommentToIssue(context: Context, message: HandlerReturnValuesNoVoid, issueNumber?: number) {
  let comment = message as string;
  if (message instanceof LogReturn) {
    comment = message.logMessage.diff;
    console.trace("one of the places that metadata is being serialized as an html comment. this one is unexpected and serves as a fallback");
    const metadataSerialized = JSON.stringify(message.metadata);
    const metadataSerializedAsComment = `<!-- ${metadataSerialized} -->`;
    comment = comment.concat(metadataSerializedAsComment);
  }

  const { payload } = context;

  const issueNum = issueNumber ?? payload.issue.number;
  try {
    await context.octokit.issues.createComment({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: issueNum,
      body: comment,
    });
  } catch (e: unknown) {
    context.logger.fatal("Adding a comment failed!", e);
  }
}
