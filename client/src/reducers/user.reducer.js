const initialState = {
  loggedIn: false,
  circuit: null,
  id: null,
};

const userReducer = (state = initialState, action) => {

  switch (action.type) {
    case 'LOG_IN':
      return { ...state, loggedIn: true, id: action.id, circuit: action.circuit };
    case 'LOG_OUT':
      return initialState;
    case 'CLAIM_CIRCUIT':
      return { ...state, circuit: action.circuit };
    case 'EJECT_CIRCUIT':
      return { ...state, circuit: null };
    default:
      return state;
  }

}

export default userReducer;
