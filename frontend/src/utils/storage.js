const AUTH_STORAGE_KEY = "sf-tutorial-auth";

export const loadAuthState = () => {
  try {
    const rawState = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!rawState) {
      return {
        token: null,
        user: null,
      };
    }

    const parsedState = JSON.parse(rawState);
    return {
      token: parsedState.token || null,
      user: parsedState.user || null,
    };
  } catch (_error) {
    return {
      token: null,
      user: null,
    };
  }
};

export const saveAuthState = (state) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
};

export const clearAuthState = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};
