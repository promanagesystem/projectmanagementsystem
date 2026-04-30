const Ziggy = {
    url: 'https:\/\/projectmanagementsystem.free.laravel.cloud/',
    port: null,
    defaults: {},
    routes: {
        login: { uri: 'login', methods: ['GET', 'HEAD'] },
        'login.store': { uri: 'login', methods: ['POST'] },
        logout: { uri: 'logout', methods: ['POST'] },
        'password.confirm': {
            uri: 'user\/confirm-password',
            methods: ['GET', 'HEAD'],
        },
        'password.confirmation': {
            uri: 'user\/confirmed-password-status',
            methods: ['GET', 'HEAD'],
        },
        'password.confirm.store': {
            uri: 'user\/confirm-password',
            methods: ['POST'],
        },
        'two-factor.login': {
            uri: 'two-factor-challenge',
            methods: ['GET', 'HEAD'],
        },
        'two-factor.login.store': {
            uri: 'two-factor-challenge',
            methods: ['POST'],
        },
        'two-factor.enable': {
            uri: 'user\/two-factor-authentication',
            methods: ['POST'],
        },
        'two-factor.confirm': {
            uri: 'user\/confirmed-two-factor-authentication',
            methods: ['POST'],
        },
        'two-factor.disable': {
            uri: 'user\/two-factor-authentication',
            methods: ['DELETE'],
        },
        'two-factor.qr-code': {
            uri: 'user\/two-factor-qr-code',
            methods: ['GET', 'HEAD'],
        },
        'two-factor.secret-key': {
            uri: 'user\/two-factor-secret-key',
            methods: ['GET', 'HEAD'],
        },
        'two-factor.recovery-codes': {
            uri: 'user\/two-factor-recovery-codes',
            methods: ['GET', 'HEAD'],
        },
        'two-factor.regenerate-recovery-codes': {
            uri: 'user\/two-factor-recovery-codes',
            methods: ['POST'],
        },
        home: { uri: '\/', methods: ['GET', 'HEAD'] },
        'dashboard.index': { uri: 'dashboard', methods: ['GET', 'HEAD'] },
        'projects.index': { uri: 'projects', methods: ['GET', 'HEAD'] },
        'projects.create': {
            uri: 'projects\/create',
            methods: ['GET', 'HEAD'],
        },
        'projects.store': { uri: 'projects', methods: ['POST'] },
        'projects.show': {
            uri: 'projects\/{project}',
            methods: ['GET', 'HEAD'],
            parameters: ['project'],
            bindings: { project: 'id' },
        },
        'projects.edit': {
            uri: 'projects\/{project}\/edit',
            methods: ['GET', 'HEAD'],
            parameters: ['project'],
        },
        'projects.update': {
            uri: 'projects\/{project}',
            methods: ['PUT', 'PATCH'],
            parameters: ['project'],
            bindings: { project: 'id' },
        },
        'projects.destroy': {
            uri: 'projects\/{project}',
            methods: ['DELETE'],
            parameters: ['project'],
            bindings: { project: 'id' },
        },
        'projects.members.store': {
            uri: 'projects\/{project}\/members',
            methods: ['POST'],
            parameters: ['project'],
            bindings: { project: 'id' },
        },
        'projects.sprints.index': {
            uri: 'projects\/{project}\/sprints',
            methods: ['GET', 'HEAD'],
            parameters: ['project'],
            bindings: { project: 'id' },
        },
        'projects.sprints.create': {
            uri: 'projects\/{project}\/sprints\/create',
            methods: ['GET', 'HEAD'],
            parameters: ['project'],
            bindings: { project: 'id' },
        },
        'projects.sprints.store': {
            uri: 'projects\/{project}\/sprints',
            methods: ['POST'],
            parameters: ['project'],
            bindings: { project: 'id' },
        },
        'projects.sprints.show': {
            uri: 'projects\/{project}\/sprints\/{sprint}',
            methods: ['GET', 'HEAD'],
            parameters: ['project', 'sprint'],
            bindings: { project: 'id', sprint: 'id' },
        },
        'projects.sprints.edit': {
            uri: 'projects\/{project}\/sprints\/{sprint}\/edit',
            methods: ['GET', 'HEAD'],
            parameters: ['project', 'sprint'],
            bindings: { project: 'id', sprint: 'id' },
        },
        'projects.sprints.update': {
            uri: 'projects\/{project}\/sprints\/{sprint}',
            methods: ['PUT', 'PATCH'],
            parameters: ['project', 'sprint'],
            bindings: { project: 'id', sprint: 'id' },
        },
        'projects.sprints.destroy': {
            uri: 'projects\/{project}\/sprints\/{sprint}',
            methods: ['DELETE'],
            parameters: ['project', 'sprint'],
            bindings: { project: 'id', sprint: 'id' },
        },
        'projects.tasks.index': {
            uri: 'projects\/{project}\/tasks',
            methods: ['GET', 'HEAD'],
            parameters: ['project'],
        },
        'projects.tasks.create': {
            uri: 'projects\/{project}\/tasks\/create',
            methods: ['GET', 'HEAD'],
            parameters: ['project'],
        },
        'projects.tasks.store': {
            uri: 'projects\/{project}\/tasks',
            methods: ['POST'],
            parameters: ['project'],
        },
        'projects.tasks.show': {
            uri: 'projects\/{project}\/tasks\/{task}',
            methods: ['GET', 'HEAD'],
            parameters: ['project', 'task'],
            bindings: { project: 'id' },
        },
        'projects.tasks.edit': {
            uri: 'projects\/{project}\/tasks\/{task}\/edit',
            methods: ['GET', 'HEAD'],
            parameters: ['project', 'task'],
        },
        'projects.tasks.update': {
            uri: 'projects\/{project}\/tasks\/{task}',
            methods: ['PUT', 'PATCH'],
            parameters: ['project', 'task'],
            bindings: { project: 'id', task: 'id' },
        },
        'projects.tasks.destroy': {
            uri: 'projects\/{project}\/tasks\/{task}',
            methods: ['DELETE'],
            parameters: ['project', 'task'],
            bindings: { project: 'id' },
        },
        'projects.sprints.tasks.index': {
            uri: 'projects\/{project}\/sprints\/{sprint}\/tasks',
            methods: ['GET', 'HEAD'],
            parameters: ['project', 'sprint'],
        },
        'projects.sprints.tasks.create': {
            uri: 'projects\/{project}\/sprints\/{sprint}\/tasks\/create',
            methods: ['GET', 'HEAD'],
            parameters: ['project', 'sprint'],
        },
        'projects.sprints.tasks.store': {
            uri: 'projects\/{project}\/sprints\/{sprint}\/tasks',
            methods: ['POST'],
            parameters: ['project', 'sprint'],
        },
        'projects.sprints.tasks.show': {
            uri: 'projects\/{project}\/sprints\/{sprint}\/tasks\/{task}',
            methods: ['GET', 'HEAD'],
            parameters: ['project', 'sprint', 'task'],
            bindings: { project: 'id', sprint: 'id', task: 'id' },
        },
        'projects.sprints.tasks.edit': {
            uri: 'projects\/{project}\/sprints\/{sprint}\/tasks\/{task}\/edit',
            methods: ['GET', 'HEAD'],
            parameters: ['project', 'sprint', 'task'],
        },
        'projects.sprints.tasks.update': {
            uri: 'projects\/{project}\/sprints\/{sprint}\/tasks\/{task}',
            methods: ['PUT', 'PATCH'],
            parameters: ['project', 'sprint', 'task'],
            bindings: { project: 'id', task: 'id' },
        },
        'projects.sprints.tasks.destroy': {
            uri: 'projects\/{project}\/sprints\/{sprint}\/tasks\/{task}',
            methods: ['DELETE'],
            parameters: ['project', 'sprint', 'task'],
            bindings: { project: 'id', sprint: 'id', task: 'id' },
        },
        'projects.tasks.updateStatus': {
            uri: 'projects\/{project}\/tasks\/{task}\/update-status',
            methods: ['PATCH'],
            parameters: ['project', 'task'],
            bindings: { project: 'id', task: 'id' },
        },
        'tasks.my': { uri: 'my-tasks', methods: ['GET', 'HEAD'] },
        'projects.sprints.tasks.subtasks.store': {
            uri: 'projects\/{project}\/tasks\/{task}\/subtasks',
            methods: ['POST'],
            parameters: ['project', 'task'],
            bindings: { task: 'id' },
        },
        'projects.sprints.tasks.subtasks.updateStatus': {
            uri: 'subtasks\/{subtask}\/status',
            methods: ['PATCH'],
            parameters: ['subtask'],
            bindings: { subtask: 'id' },
        },
        'projects.sprints.tasks.subtasks.destroy': {
            uri: 'subtasks\/{subtask}',
            methods: ['DELETE'],
            parameters: ['subtask'],
            bindings: { subtask: 'id' },
        },
        'attachments.project.index': {
            uri: 'projects\/{project}\/attachments',
            methods: ['GET', 'HEAD'],
            parameters: ['project'],
            bindings: { project: 'id' },
        },
        'attachments.storeProject': {
            uri: 'projects\/{project}\/attachments',
            methods: ['POST'],
            parameters: ['project'],
            bindings: { project: 'id' },
        },
        'attachments.destroyProject': {
            uri: 'projects\/{project}\/attachments\/{attachment}',
            methods: ['DELETE'],
            parameters: ['project', 'attachment'],
            bindings: { project: 'id', attachment: 'id' },
        },
        'attachments.index': {
            uri: 'projects\/{project}\/tasks\/{task}\/attachments',
            methods: ['GET', 'HEAD'],
            parameters: ['project', 'task'],
            bindings: { project: 'id', task: 'id' },
        },
        'attachments.store': {
            uri: 'projects\/{project}\/tasks\/{task}\/attachments',
            methods: ['POST'],
            parameters: ['project', 'task'],
            bindings: { project: 'id', task: 'id' },
        },
        'attachments.destroy': {
            uri: 'projects\/{project}\/tasks\/{task}\/attachments\/{attachment}',
            methods: ['DELETE'],
            parameters: ['project', 'task', 'attachment'],
            bindings: { project: 'id', task: 'id', attachment: 'id' },
        },
        'activity.logs.index': {
            uri: 'activity-logs',
            methods: ['GET', 'HEAD'],
        },
        'projects.reports.showAll': { uri: 'report', methods: ['GET', 'HEAD'] },
        'projects.reports.show': {
            uri: 'report\/{project}',
            methods: ['GET', 'HEAD'],
            parameters: ['project'],
            bindings: { project: 'id' },
        },
        'projects.reports.generate': {
            uri: 'report\/generate',
            methods: ['POST'],
        },
        'profile.edit': { uri: 'settings\/profile', methods: ['GET', 'HEAD'] },
        'profile.update': { uri: 'settings\/profile', methods: ['PATCH'] },
        'profile.destroy': { uri: 'settings\/profile', methods: ['DELETE'] },
        'password.edit': {
            uri: 'settings\/password',
            methods: ['GET', 'HEAD'],
        },
        'password.update': { uri: 'settings\/password', methods: ['PUT'] },
        'appearance.edit': {
            uri: 'settings\/appearance',
            methods: ['GET', 'HEAD'],
        },
        'two-factor.show': {
            uri: 'settings\/two-factor',
            methods: ['GET', 'HEAD'],
        },
        register: { uri: 'register', methods: ['GET', 'HEAD'] },
        'register.store': { uri: 'register', methods: ['POST'] },
        'password.request': {
            uri: 'forgot-password',
            methods: ['GET', 'HEAD'],
        },
        'password.email': { uri: 'forgot-password', methods: ['POST'] },
        'password.reset': {
            uri: 'reset-password\/{token}',
            methods: ['GET', 'HEAD'],
            parameters: ['token'],
        },
        'password.store': { uri: 'reset-password', methods: ['POST'] },
        'verification.notice': {
            uri: 'verify-email',
            methods: ['GET', 'HEAD'],
        },
        'verification.verify': {
            uri: 'verify-email\/{id}\/{hash}',
            methods: ['GET', 'HEAD'],
            parameters: ['id', 'hash'],
        },
        'verification.send': {
            uri: 'email\/verification-notification',
            methods: ['POST'],
        },
        'storage.local': {
            uri: 'storage\/{path}',
            methods: ['GET', 'HEAD'],
            wheres: { path: '.*' },
            parameters: ['path'],
        },
    },
};
if (typeof window !== 'undefined' && typeof window.Ziggy !== 'undefined') {
    Object.assign(Ziggy.routes, window.Ziggy.routes);
}
export { Ziggy };
