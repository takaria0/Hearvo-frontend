const mixpanel = require("mixpanel-browser");

mixpanel.init(process.env.REACT_APP_MIX_PANEL_TOKEN);

const env_check = process.env.REACT_APP_ENV === "prod";

const actions = {
  identify: (id: string | number) => {
    if (env_check) mixpanel.identify(id);
  },
  alias: (id: string | number) => {
    if (env_check) mixpanel.alias(id);
  },
  track: (name: string, props: any) => {
    if (env_check) mixpanel.track(name, props);
  },
  people: {
    set: (props: any) => {
      if (env_check) mixpanel.people.set(props);
    },
  },
};

export const Mixpanel = actions;
