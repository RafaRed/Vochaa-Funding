export const loadState = () => {
    try {
      const serialState = localStorage.getItem('appState');
      if (serialState === null) {
        return undefined;
      }
      return JSON.parse(serialState);
    } catch (err) {
      return undefined;
    }
};


export const saveState = (state) => {
    try {
      localStorage.setItem('appState', JSON.stringify(state));
    } catch(err) {
        console.log(err);
    }
};