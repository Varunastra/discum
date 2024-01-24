export type DiscordUserInfo = {
    username:string;
    discriminator:string;
    userid:string;
};

export type DiscordGatewayScheme<TData> = {
    d:TData;
    op:GatewayOperationCode;
    t?:string;
    s?:number;
}

export const enum GatewayOperationCode {
    DISPATCH = 0,
    HEARTBEAT = 1,
    IDENTIFY = 2,
    PRESENCE = 3,
    VOICE_STATE = 4,
    RESUME = 6,
    RECONNECT = 7,
    REQUEST_MEMBERS = 8,
    INVALID_SESSION = 9,
    HELLO = 10,
    HEARTBEAT_ACK = 11,
};

export const enum ActivityType {
    PLAYING = 0,
    STREAMING = 1,
    LISTENING = 2,
    WATCHING = 3,
    CUSTOM = 4,
    COMPETING = 5,
};

export type InitialGatewayResponse = DiscordGatewayScheme<{ heartbeat_interval:number; }>;