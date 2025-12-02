"use client"

import "../css/overlappr.scss";
import MainContext from "../context";
import { useEffect, useState } from "react";
import Auth from "../components/Auth";
import MainPage from "./MainPage";
import { Component, Playlist, User } from "../types";

export default function OverlapprHome() {

	return (
		<div className="overlappr">
			<main>
				<MainPage />
			</main>
		</div>
	);
}
