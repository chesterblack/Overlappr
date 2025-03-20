import authEndpointGet from "./GET";

export async function GET( request ) {
	return await authEndpointGet( request );
}
