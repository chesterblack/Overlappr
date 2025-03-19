/**
 * Send a request to this site's API
 * 
 * @param {string} method
 * @param {string} endpoint 
 * @param {Object} [urlParams] 
 * @param {Object} [body] 
 * @param {Object} [options] 
 * @returns {NextResponse}
 */
export async function sendInternalApiRequest(
  method,
  endpoint,
  urlParams = null,
  body = null,
  options = {}
) {
  urlParams = urlParams ? new URLSearchParams( urlParams ) : '';

  options = {
    cache: "no-store",
    method,
    ...options
  };

  if ([ 'POST', 'PATCH' ].includes(method) && body) {
    options.body = JSON.stringify(body);
  }

  return await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api${endpoint}?${urlParams}`,
    options
  )
    .then((res) => res.json())
    .catch((e) => console.error(e))
}

export async function sendSpotifyApiRequest( path, accessToken ) {
  return await fetch(`https://api.spotify.com/v1/${ path }`, {
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  })
    .then( res => res.json() )
    .catch( e => console.error(e) )
}