---
title: Infrastructure & Security
summary: Learn how Stacklane protects data and encourages security best practices.
---

The Stacklane platform distills over 20 years of web software experience
into essential and primary patterns,
while abstracting best-in-class, no-compromise cloud infrastructure completely.

Cloud infrastructure services are rapidly
changing and your code should not have to change with it.
We have selected key providers to power our current services, and we're
constantly evaluating new offerings for incorporation into Stacklane.

# Redundancy

Highly available and durable, you can focus on building applications
without worrying about traffic spikes.
Sharding and replication are automatic,
with data stored simultaneously across multiple geographically
separated regions in North America.
All data hosted through Stacklane is encrypted at rest.

# Global Scale
   
Endpoints are deployed simultaneously to US West, US Central, and Western Europe regions.
Assets such as images and styles are delivered from 80+ CDN edge locations worldwide.
       
# HTTP/2 Enabled

HTTP/2 speeds up your site, and eliminates many
crutches that have been created to speed up sites with the aging HTTP/1.1.
"These hacks are indications of underlying problems in the protocol itself,
and cause a number of problems on their own when used."
(<a href="https://http2.github.io/faq/">HTTP/2 FAQ</a>).
Simplify your code and start using HTTP/2 with Stacklane.

Web developers no longer need to focus on
reducing HTTP requests (by bundling, concatenating, or inlining)
&mdash;
instead small, granular resources can be cached independently and transferred in parallel.
Concatenating files is no longer a best practice in HTTP/2.
Even if only a single line of CSS is changed, browsers are forced to reload all of your CSS declarations.
Similarly inlining CSS or external JS directly into an HTML page is discouraged,
as it means that browsers can't cache individual assets.

(Note: All current browsers require SSL for HTTP/2)

# Content Security Policies {#csp}

All pages served by Stacklane use a Content Security Policy (CSP).
<a target="_blank" href="https://en.wikipedia.org/wiki/Content_Security_Policy">Content Security Policies</a>
are a security standard which helps prevent common techniques for cross-site scripting (XSS), clickjacking, and other
code injection attacks.

The CSP header allows a host to declare trusted sources of content (JS execution, CSS styles, images etc).
Stacklane makes using CSP easy through a combination of
[automatic behavior and custom declarations](/🗄/Article/endpoints/mustache.md#csp).