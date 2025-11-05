import { IgApiClient } from 'instagram-private-api';

let igClient: IgApiClient | null = null;
let connectedUsername: string | null = null;

export function getIgClient() {
  return igClient;
}

export function setIgClient(client: IgApiClient | null) {
  igClient = client;
}

export function getConnectedUsername() {
  return connectedUsername;
}

export function setConnectedUsername(username: string | null) {
  connectedUsername = username;
}
