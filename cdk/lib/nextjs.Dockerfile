ARG BUILDER_IMAGE_TAG
FROM $BUILDER_IMAGE_TAG AS builder

FROM public.ecr.aws/docker/library/node:22-alpine AS runner
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.3 /lambda-adapter /opt/extensions/lambda-adapter
WORKDIR /app

ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

USER nextjs
EXPOSE 3000
ENV PORT=3000

# command comes from the image asset definition