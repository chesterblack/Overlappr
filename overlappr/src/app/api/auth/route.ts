import { NextRequest } from "next/server";
import authEndpointGet from "./GET";

export async function GET( request: NextRequest ): ReturnType<typeof authEndpointGet> {
	return await authEndpointGet( request );
}
