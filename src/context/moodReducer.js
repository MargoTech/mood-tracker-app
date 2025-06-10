import { produce } from "immer";

export function moodReducer(state, action) {
  switch (action.type) {
    case "SET":
      return action.payload;
    default:
      return produce(state, (draft) => {
        switch (action.type) {
          case "ADD":
            draft.push(action.payload);
            break;
          case "DELETE":
            const index = draft.findIndex((m) => m.id === action.payload);
            if (index !== -1) draft.splice(index, 1);
            break;
          case "UPDATE":
            const i = draft.findIndex((m) => m.id === action.payload.id);
            if (i !== -1) draft[i] = action.payload;
            break;
        }
      });
  }
}
