import taskHandlers from './tasks';
import listHandlers from './lists';

const handlers = [...taskHandlers, ...listHandlers];

export default handlers;