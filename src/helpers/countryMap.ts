/*
match Cloudflare country code and sub domain of Hearvo.
*/

interface StringKeyObject {
  [key: string]: string;
}
const CLOUDFLARE_TO_SUBDOMAIN_LIST: StringKeyObject = { "jp": "jp", "us": "us", "gr": "uk" };

const CLOUDFLARE_TO_SUBDOMAIN = (countryCode: string) => {

  if (Object.keys(CLOUDFLARE_TO_SUBDOMAIN_LIST).includes(countryCode)) {
    return CLOUDFLARE_TO_SUBDOMAIN_LIST[countryCode]
  } else {
    return ""
  }

}

export default CLOUDFLARE_TO_SUBDOMAIN;