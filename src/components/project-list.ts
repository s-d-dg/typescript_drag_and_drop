/// <reference path="../models/drag-drop.ts" />
/// <reference path="../models/project.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="base-component.ts" />
/// <reference path="../state/project-state.ts" />

namespace App {
    // ProjectList Class
    export class ProjectList extends BaseComponent<HTMLDivElement, HTMLElement> implements DragTarget {
        assignedProjects: Project[] = [];

        constructor(private type: 'active' | 'finished') {
            super('project-list', 'app', false, `${type}-projects`);

            this.configure();
            this.renderContent();
        }

        @autobind
        dragOverHandler(event: DragEvent): void {
            if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault();
                const listEl = this.element.querySelector('ul')!;
                listEl.classList.add('droppable');
            }
        }

        @autobind
        dropHandler(event: DragEvent): void {
            const projectId = event.dataTransfer!.getData('text/plain');

            projectState.moveProject(projectId, this.areaLinkedStatus());
        }

        @autobind
        dragLeaveHandler(_: DragEvent): void {
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.remove('droppable');
        }

        configure(): void {
            this.element.addEventListener('dragover', this.dragOverHandler);
            this.element.addEventListener('dragleave', this.dragLeaveHandler);
            this.element.addEventListener('drop', this.dropHandler);

            projectState.addListener((projects: Project[]) => {
                const relevantProjects = projects.filter(project => {
                    return project.status === this.areaLinkedStatus();
                });
                this.assignedProjects = relevantProjects;
                this.renderProjects();
            });
        }

        renderContent() {
            const listId = `${this.type}-projects-list`;
            this.element.querySelector('ul')!.id = listId;
            this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
        }

        private renderProjects() {
            const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
            listEl.innerHTML = '';
            for (const projectItem of this.assignedProjects) {
                new ProjectItem(this.element.querySelector('ul')!.id, projectItem);
            }
        }

        private areaLinkedStatus(): ProjectStatus {
            if (this.type === 'active') {
                return ProjectStatus.Active;
            }
            return ProjectStatus.Finished;
        }
    }
}
