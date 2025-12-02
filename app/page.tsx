"use client"

import { useEffect, useState } from "react";
import Auth from "./components/Auth";
import { Component, Playlist, User } from "./types";
import ToolList from "./components/ToolList";

export default function Homepage() {
	return <ToolList />
}