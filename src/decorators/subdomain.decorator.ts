import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { URL } from 'url';

// Custom decorator to extract the subdomain from the referer header
export const Subdomain = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const referer = request.headers.referer;

    if (!referer) {
      return null;
    }

    const url = new URL(referer);
    const hostname = url.hostname;

    // Extract the subdomain
    const subdomain = getSubdomainFromHostname(hostname);
    return subdomain;
  },
);

const getSubdomainFromHostname = (hostname: string): string | null => {
  const parts = hostname.split('.');
  if (parts.length > 2) {
    // Assuming the subdomain is the first part of the hostname
    return parts.slice(0, -2).join('.');
  }
  return null;
};
