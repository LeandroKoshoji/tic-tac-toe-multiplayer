import { v4 as uuidv4 } from 'uuid';
export const generateID = (): string => {
    const id = uuidv4()
    return id
}

export const SocketEmitEvents = Object.freeze({
    CHECK_ROOM: 'check_room',
    START_GAME: 'start_game',
    PLAYER_MOVE: 'player_move',
    REMATCH: 'rematch'
})

export const SocketOnEvents = Object.freeze({
    READY_TO_START: 'ready_to_start',
    GAME_UPDATE: 'game_update',
    START_REMATCH_GAME: 'start_rematch_game',
    PLAYER_DISCONNECTED: 'player_disconnected'
})