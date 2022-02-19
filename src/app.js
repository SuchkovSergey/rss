import watchState from './watchers';
import { checkForNewPosts, setListeners } from './utils';
import { initializeI18next } from './languages/utils';
import { STATE_TYPES } from './constants';

const app = () => {
    const state = {
        feeds: [],
        posts: [],
        currentLang: 'English',
        form: {
            processState: STATE_TYPES.FINISHED,
            fields: {
                url: '',
            },
            errors: [],
            valid: false,
        },
    };

    initializeI18next(state);

    setListeners(state);

    checkForNewPosts(state);
    watchState(state);
};

export default app;
