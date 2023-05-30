<template>
  <div>
    <div class="row">
      <div class="col-lg-12">
        <div class="float-right">
          <router-link
            v-tooltip="'Gerenciar as tags do projeto'"
            :to="`/${endpoint}/projetos/${$route.params.id}/tags?voltar=projeto`"
            class="btn btn-white mb-3"
          >
            <i class="fas fa-tags text-success mr-2" />Tags
          </router-link>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <card type="secondary">
          <div slot="header" class="bg-white border-0">
            <div class="row align-items-center">
              <div class="col-12">
                <h3 class="mb-0">
                  <i class="fas fa-project-diagram mr-2" /> Tarefas do projeto
                  <span class="text-warning">{{ project.title }}</span>
                </h3>
              </div>
            </div>
          </div>
          <div id="scrollable">
            <div id="vld-parent" ref="project_task">
              <div class="row">
                <Container
                  group-name="column"
                  orientation="horizontal"
                  :drop-placeholder="upperDropPlaceholderOptions"
                  :get-child-payload="getChildPayload"
                  @drag-start="dragStartColumn"
                  @drop="onDropColumn"
                >
                  <Draggable
                    v-for="(column, index) in project.columns"
                    :key="`col_${column.id}_${index}`"
                  >
                    <card
                      type="secondary"
                      class="column-project ml-4 shadow-sm"
                      body-classes="pb-2"
                    >
                      <div slot="header" class="bg-white border-0">
                        <div class="row align-items-center">
                          <div class="col-12">
                            <h3 class="mb-0">
                              <span class="text-default">{{
                                column.title
                              }}</span>
                              <span class="float-right">
                                <base-button
                                  v-tooltip.bottom="'Excluir coluna'"
                                  type="white"
                                  size="sm"
                                  class="text-primary"
                                  @click="handleOpenModalRemoveColumn(column)"
                                >
                                  <i class="fas fa-trash text-danger" />
                                </base-button>
                                <base-button
                                  v-tooltip.bottom="'Editar coluna'"
                                  type="white"
                                  size="sm"
                                  class="text-primary"
                                  @click="handleOpenModalColumn(column, false)"
                                >
                                  <i class="fas fa-edit text-info" />
                                </base-button>
                              </span>
                            </h3>
                          </div>
                        </div>
                      </div>
                      <div v-if="!column.tasks.length" class="text-center">
                        <badge type="primary">Sem tarefas até o momento</badge>
                      </div>
                      <vue-custom-scrollbar class="scroll-column">
                        <Container
                          group-name="task"
                          drag-class="card-ghost"
                          drop-class="card-ghost-drop"
                          :drop-placeholder="dropPlaceholderOptions"
                          :get-child-payload="getChildPayload"
                          @drag-start="dragStartTask(index, $event)"
                          @drop="onDropTask(index, $event)"
                        >
                          <Draggable
                            v-for="(task, drag_index) in column.tasks"
                            :key="`col_${column.id}_task_${task.id}_${drag_index}`"
                          >
                            <card class="task-project mb-2">
                              <div class="row">
                                <div class="col-12">
                                  <badge
                                    v-for="(tag, card_index) in task.tags"
                                    :key="`task_${task.id}_tag_${tag.id}_${card_index}`"
                                    v-tooltip.bottom="tag.title"
                                    :type="tag.color"
                                    class="mx-1 badge mb-2"
                                  >
                                    {{ tag.title }}
                                  </badge>
                                </div>
                              </div>
                              <div
                                class="row cursor"
                                @click="
                                  handleOpenModalViewTask(task, column.title)
                                "
                              >
                                <div class="col-lg-12">
                                  <span class="float-right">
                                    <i
                                      v-tooltip.bottom="
                                        'Visualizar/editar conteúdo'
                                      "
                                      class="fas fa-eye text-primary"
                                    />
                                  </span>
                                </div>
                                <div class="col-lg-9">
                                  {{ truncate(task.title, 50) }}
                                </div>
                                <div class="col-lg-12 task-info mt-4">
                                  <span v-if="task.start_date && task.end_date">
                                    <i class="fas fa-calendar mr-2" />
                                    {{
                                      formatDate(task.start_date, "L") || "--"
                                    }}
                                    -
                                    {{ formatDate(task.end_date, "L") || "--" }}
                                  </span>
                                  <span v-else-if="task.end_date">
                                    <i class="fas fa-calendar mr-2" /> Até
                                    {{ formatDate(task.end_date, "L") }}
                                  </span>
                                  <span class="float-right">
                                    <i
                                      v-tooltip.bottom="
                                        task.status === 'pending'
                                          ? 'Tarefa pendente'
                                          : 'Tarefa concluída'
                                      "
                                      :class="[
                                        'fas',
                                        task.status === 'pending'
                                          ? 'fa-spinner'
                                          : 'fa-check',
                                      ]"
                                    />
                                  </span>
                                </div>
                              </div>
                            </card>
                          </Draggable>
                        </Container>
                      </vue-custom-scrollbar>
                      <hr class="m-1" />
                      <div
                        class="cursor text-primary new-item"
                        @click="handleOpenModalNewTask(column)"
                      >
                        <div class="text-center">
                          <i class="fas fa-plus mr-1 fa-1x py-4" />
                          Adicionar nova tarefa
                        </div>
                      </div>
                    </card>
                  </Draggable>
                  <div @click="handleOpenModalColumn(null, true)">
                    <card
                      class="ml-4 mr-4 shadow-sm text-center cursor new-item column-project"
                    >
                      <div>
                        <div class="text-center text-primary">
                          <i class="fas fa-plus mr-1 fa-1x" />
                          Adicionar nova coluna
                        </div>
                      </div>
                    </card>
                  </div>
                </Container>
              </div>
            </div>
          </div>
        </card>
      </div>
    </div>
    <modal
      :show.sync="modals.modalColumn.show"
      modal-classes="modal-dialog-centered modal-lg"
      body-classes="pb-0"
      header-classes="pb-0"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Nova coluna
      </h6>
      <div ref="modal_new_column" class="vld-parent">
        <div class="py-3 text-center">
          <i class="fas fa-columns fa-3x" />
          <div v-if="modals.modalColumn.new">
            <h4 class="heading mt-4">Adicionar nova coluna ao projeto</h4>
            <p class="mt-3 mb-0">
              Após adicionar a coluna você poderá alterar a ordem de exibição da
              mesma ao arrastar as colunas para a posição desejada.
            </p>
          </div>
          <div v-else>
            <h4 class="heading mt-4">
              Editar coluna
              <span class="text-warning">
                {{ modals.modalColumn.column.title }}
              </span>
            </h4>
          </div>
        </div>
        <div class="col-lg-12">
          <base-input
            v-model="modals.modalColumn.column.title"
            label="Título da coluna"
            placeholder="Digite o título"
          />
        </div>
        <div v-if="!modals.modalColumn.new" class="col-lg-12 mt-3">
          <p class="text-right description mt-3 mb-0">
            <i class="far fa-clock mr-1" /> Criado em
            {{ formatTimestamp(modals.modalColumn.column.created_at, "lll") }}.
            Atualizado em
            {{ formatTimestamp(modals.modalColumn.column.updated_at, "lll") }}.
          </p>
        </div>
        <div class="col-12 text-center">
          <base-alert
            v-if="modals.modalColumn.error"
            type="danger"
            class="text-center"
          >
            {{ modals.modalColumn.error }}
          </base-alert>
        </div>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="dark"
          class="ml-auto"
          @click="modals.modalColumn.show = false"
        >
          Voltar
        </base-button>
        <base-button
          v-if="modals.modalColumn.new"
          :disabled="!modals.modalColumn.column.title"
          type="primary"
          @click="handleSubmitNewColumn()"
        >
          Adicionar coluna
        </base-button>
        <base-button
          v-else
          type="primary"
          :disabled="!modals.modalColumn.column.title"
          @click="handleSubmitUpdateColumn()"
        >
          Salvar alterações
        </base-button>
      </template>
    </modal>
    <modal
      :show.sync="modals.modalNewTask.show"
      modal-classes="modal-dialog-centered modal-xl"
      body-classes="pb-0"
      header-classes="pb-0"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Nova tarefa
      </h6>
      <div>
        <div class="py-3 text-center">
          <i class="fas fa-sticky-note fa-3x" />
          <h4 class="heading mt-4">
            Adicionar nova tarefa à coluna
            <span class="text-warning">
              {{ modals.modalNewTask.column.title }}
            </span>
          </h4>
          <p class="mt-3 mb-0">
            Após adicionar a tarefa você poderá alterar a sua ordem de exibição
            na coluna
            <span class="text-warning">
              {{ modals.modalNewTask.column.title }}
            </span>
            ou em outra coluna ao arrastar a tarefa para a posição desejada.
          </p>
        </div>
        <div ref="modal_new_task" class="vld-parent">
          <form role="form">
            <div class="row ml-1">
              <h6 class="heading-small text-muted">Informações básicas</h6>
            </div>
            <div class="row mx-2">
              <div class="col-lg-6">
                <base-input
                  ref="column"
                  v-model="model.task.title"
                  label="Título da tarefa*"
                  placeholder="Digite o título"
                />
              </div>
              <hr class="my-4" />
              <div class="col-lg-6">
                <label class="form-control-label"> Status da tarefa* </label>
                <div>
                  <base-input>
                    <select v-model="model.task.status" class="form-control">
                      <option disabled selected value="">
                        Selecione o status da tarefa
                      </option>
                      <option value="pending">Pendente</option>
                      <option value="finished">Concluída</option>
                    </select>
                  </base-input>
                </div>
              </div>
              <div class="col-lg-6">
                <label class="form-control-label d-block">
                  Data de início
                  <base-button
                    size="sm"
                    type="link"
                    class="p-0 m-0 ml-2 float-right"
                    @click="setCurrentDate(true)"
                  >
                    Usar data atual
                  </base-button>
                </label>
                <base-input
                  ref="column"
                  v-model="model.task.start_date"
                  type="date"
                  placeholder="Digite o título"
                />
              </div>
              <div class="col-lg-6">
                <base-input
                  ref="column"
                  v-model="model.task.end_date"
                  label="Data de término"
                  type="date"
                  placeholder="Digite o título"
                />
              </div>
              <div class="col-lg-12">
                <label class="form-control-label"> Descrição da tarefa </label>
                <div class="np-container-edditable">
                  <quill-editor
                    v-model="model.task.description"
                    :options="editorEdittable"
                  />
                </div>
              </div>
            </div>
            <div v-if="!project.is_private">
              <hr class="my-4" />
              <div class="row ml-1 mt-4">
                <h6 class="heading-small text-muted">Responsável</h6>
              </div>
              <div class="row mx-2">
                <div class="col-lg-6">
                  <label class="form-control-label">
                    Responsável pela tarefa*
                  </label>
                  <v-select
                    v-model="selectedUser"
                    class="responsible_select mt-2"
                    placeholder="Busque por um usuário (nome)"
                    label="name"
                    :options="participants"
                    :filter-by="filterByName"
                    @input="handleSelectResponsible"
                  >
                    <template v-slot:option="option">
                      {{ option.name }}
                    </template>
                    <span slot="no-options">
                      Não foram encontrados participantes
                    </span>
                  </v-select>
                </div>
              </div>
            </div>
            <hr class="my-4" />
            <div class="row ml-1 mt-4">
              <h6 class="heading-small text-muted">Tags</h6>
            </div>
            <label class="form-control-label ml-2">
              Tags associadas à tarefa
            </label>
            <div class="row mx-2">
              <div class="col-lg-8">
                <div v-if="tags.length" class="row">
                  <div
                    v-for="(tag, index) in tags"
                    :key="`newTag_${index}_${tag.id}`"
                    class="col-lg-4 mt-3"
                  >
                    <base-checkbox
                      v-model="tags[index].selected"
                      class="custom-control-alternative text-left mr-1"
                    >
                      <badge class="d-block ml--3" :type="tag.color">{{
                        tag.title
                      }}</badge>
                    </base-checkbox>
                  </div>
                </div>
                <div v-else>
                  <p class="mt-2">Nenhuma tag cadastrada</p>
                </div>
              </div>
              <div class="col-lg-4">
                <div class="text-center">
                  <base-button
                    type="white"
                    class="mt-3 mt-lg-0"
                    @click="modals.modalNewTag.show = true"
                  >
                    <i class="fas fa-tag mr-2 text-green" /> Cadastrar nova tag
                  </base-button>
                </div>
              </div>
            </div>
            <div class="row text-center mt-4">
              <div class="col-12">
                <base-alert v-if="modals.modalNewTask.error" type="danger">{{
                  modals.modalNewTask.error
                }}</base-alert>
              </div>
            </div>
          </form>
        </div>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="dark"
          class="ml-auto"
          @click="modals.modalNewTask.show = false"
        >
          Voltar
        </base-button>
        <span
          v-tooltip.bottom="
            !model.task.title
              ? 'Preencha os campos obrigatórios para continuar'
              : ''
          "
        >
          <base-button
            type="primary"
            :disabled="validModel"
            @click="handleSubmitNewTask()"
          >
            Adicionar tarefa
          </base-button>
        </span>
      </template>
    </modal>
    <modal
      :show.sync="modals.modalViewTask.show"
      modal-classes="modal-dialog-centered modal-xl"
      body-classes="pb-0"
      header-classes="pb-0"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Visualizar detalhes da tarefa
      </h6>
      <div>
        <div class="py-3 text-center">
          <i class="fas fa-sticky-note fa-3x" />
          <h4 class="heading mt-4">
            Editar tarefa
            <span class="text-warning">
              {{ modals.modalViewTask.task.title }}
            </span>
          </h4>
        </div>
        <div ref="modal_view_task" class="vld-parent">
          <span class="float-right">
            <base-button
              v-tooltip.bottom="'Excluir tarefa'"
              type="white"
              size="sm"
              @click="handleOpenModalRemoveTask(modals.modalViewTask.task)"
            >
              <i class="fas fa-trash text-danger mr-2" /> Remover tarefa
            </base-button>
          </span>
          <div>
            <form role="form">
              <div class="row ml-1 mt-4">
                <h6 class="heading-small text-muted">Informações básicas</h6>
              </div>
              <div class="row mx-2">
                <div class="col-lg-6">
                  <base-input
                    ref="title"
                    v-model="modals.modalViewTask.task.title"
                    label="Título da tarefa*"
                    placeholder="Digite o título"
                  />
                </div>
                <div class="col-lg-6">
                  <label class="form-control-label"> Status da tarefa* </label>
                  <div>
                    <base-input>
                      <select
                        v-model="modals.modalViewTask.task.status"
                        class="form-control"
                      >
                        <option disabled selected value="">
                          Selecione o status da tarefa
                        </option>
                        <option value="pending">Pendente</option>
                        <option value="finished">Concluída</option>
                      </select>
                    </base-input>
                  </div>
                </div>
                <div class="col-lg-6">
                  <label class="form-control-label d-block">
                    Data de início
                    <base-button
                      size="sm"
                      type="link"
                      class="p-0 m-0 ml-2 float-right"
                      @click="setCurrentDate(false)"
                    >
                      Usar data atual
                    </base-button>
                  </label>
                  <base-input
                    v-model="modals.modalViewTask.task.start_date"
                    type="date"
                  />
                </div>
                <div class="col-lg-6">
                  <base-input
                    v-model="modals.modalViewTask.task.end_date"
                    label="Data de término"
                    type="date"
                  />
                </div>
                <div class="col-lg-12">
                  <label class="form-control-label">
                    Descrição da tarefa
                  </label>
                  <div class="np-container-edditable">
                    <quill-editor
                      v-model="modals.modalViewTask.task.description"
                      :options="editorEdittable"
                    />
                  </div>
                </div>
              </div>
              <hr class="my-4" />
              <div class="row ml-1 mt-4">
                <h6 class="heading-small text-muted">Responsável</h6>
              </div>
              <div class="row mx-2">
                <div class="col-lg-6">
                  <label class="form-control-label">
                    Responsável pela tarefa*
                  </label>
                  <v-select
                    v-model="selectedUserEdit"
                    class="responsible_select"
                    placeholder="Busque por um usuário (nome)"
                    label="name"
                    :options="participants"
                    :filter-by="filterByName"
                    @input="handleSelectResponsibleEdit"
                  >
                    <template v-slot:option="option">
                      {{ option.name }}
                    </template>
                    <span slot="no-options">
                      Não foram encontrados participantes
                    </span>
                  </v-select>
                </div>
              </div>
              <hr class="my-4" />
              <div class="row ml-1 mt-4">
                <h6 class="heading-small text-muted">Tags</h6>
              </div>
              <label class="form-control-label ml-2">
                Tags associadas à tarefa
              </label>
              <div class="row mx-2">
                <div v-if="tags.length" class="col-lg-8">
                  <div class="row">
                    <div
                      v-for="(tag, index) in tags"
                      :key="`viewTag_${index}_${tag.id}`"
                      class="col-lg-4 mt-3"
                    >
                      <base-checkbox
                        v-model="tags[index].selected"
                        class="custom-control-alternative text-left mr-1"
                      >
                        <span class="d-block ml--3">
                          <badge :type="tag.color">{{ tag.title }} </badge>
                        </span>
                      </base-checkbox>
                    </div>
                  </div>
                </div>
                <div class="col-lg-4">
                  <div class="text-center">
                    <base-button
                      type="white"
                      class="mt-3"
                      @click="modals.modalNewTag.show = true"
                    >
                      <i class="fas fa-tag mr-2 text-green" />Cadastrar nova tag
                    </base-button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="row mt-3">
            <div class="col-12">
              <p class="text-right description mt-3 mb-0">
                <i class="far fa-clock mr-1" /> Criado em
                {{
                  formatTimestamp(modals.modalViewTask.task.created_at, "lll")
                }}. Atualizado em
                {{
                  formatTimestamp(modals.modalViewTask.task.updated_at, "lll")
                }}.
              </p>
            </div>
          </div>
          <div class="row text-center mt-4">
            <div class="col-12">
              <base-alert v-if="modals.modalViewTask.error" type="danger">{{
                modals.modalViewTask.error
              }}</base-alert>
            </div>
          </div>
        </div>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="dark"
          class="ml-auto"
          @click="modals.modalViewTask.show = false"
        >
          Voltar
        </base-button>
        <base-button
          type="primary"
          :disabled="validModal"
          @click="handleSubmitUpdateTask()"
        >
          Salvar alterações
        </base-button>
      </template>
    </modal>
    <modal
      :show.sync="modals.modalNewTag.show"
      modal-classes="modal-dialog-centered modal-md"
      body-classes="pb-0"
      header-classes="pb-0"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Nova tag
      </h6>
      <div ref="modal_new_tag" class="vld-parent">
        <div class="py-3 text-center">
          <i class="fas fa-tag fa-3x" />
          <h4 class="heading mt-4">Adicionar nova tag ao projeto</h4>
          <p class="mt-3 mb-0">
            Após adicionar a tag você poderá usá-la nas diferentes tarefas que
            adicionar ao seu projeto ou editá-las no menu de gerenciamento das
            tags no projeto desejado.
          </p>
        </div>
      </div>
      <div>
        <form role="form">
          <div class="row">
            <div class="col-lg-12">
              <base-input
                v-model.trim="model.tag.title"
                label="Título*"
                placeholder="Digite o título"
              />
            </div>
            <div class="col-lg-12">
              <label class="form-control-label"> Cor da tag </label>
              <div>
                <base-input>
                  <select v-model="model.tag.color" class="form-control">
                    <option selected disabled value="">
                      Selecione uma cor para a tag
                    </option>
                    <option
                      v-for="(tag, index) in tagThemes"
                      :key="`theme_${index}`"
                      :value="tag.color"
                    >
                      {{ tag.title }}
                    </option>
                  </select>
                </base-input>
              </div>
            </div>
            <div class="col-lg-12">
              <label class="form-control-label"> Pré-visualização </label>
              <div v-if="model.tag.title">
                <badge :type="model.tag.color || 'default'">{{
                  model.tag.title
                }}</badge>
              </div>
              <div v-else>-</div>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-12">
              <base-alert
                v-if="modals.modalNewTag.error"
                type="danger"
                class="text-center"
              >
                Ocorreu um erro ao cadastrar a tag. Por favor, tente novamente.
              </base-alert>
            </div>
          </div>
        </form>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="dark"
          class="ml-auto"
          @click="modals.modalNewTag.show = false"
        >
          Voltar
        </base-button>
        <base-button
          type="primary"
          :disabled="!model.tag.title"
          @click="handleSubmitNewTag()"
        >
          Adicionar tag
        </base-button>
      </template>
    </modal>
    <modal
      :show.sync="modals.modalRemoveColumn.show"
      modal-classes="modal-default modal-dialog-centered"
      body-classes="pb-0"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div ref="modal_confirmation_delete_column" class="vld-parent">
        <div class="py-3 text-center">
          <i class="fa fa-trash fa-3x" />
          <h4 class="heading mt-4">
            Você realmente deseja excluir a coluna
            <span class="text-warning">
              {{ modals.modalRemoveColumn.column.title }}
            </span>
            ?
          </h4>
          <p class="mt-3">
            Todas as informações relacionadas a ela serão perdidas, incluindo as
            tarefas.
          </p>
        </div>
        <base-alert
          v-if="modals.modalRemoveColumn.error"
          type="danger"
          class="text-center"
        >
          Ocorreu um erro ao remover a coluna. Por favor, tente novamente.
        </base-alert>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="white"
          class="ml-auto"
          @click="modals.modalRemoveColumn.show = false"
        >
          Voltar
        </base-button>
        <base-button
          type="white text-danger"
          @click="handleSubmitRemoveColumn()"
        >
          Confirmar exclusão
        </base-button>
      </template>
    </modal>
    <modal
      :show.sync="modals.modalRemoveTask.show"
      modal-classes="modal-default modal-dialog-centered"
      body-classes="pb-0"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div ref="modal_confirmation_delete_task" class="vld-parent">
        <div class="py-3 text-center">
          <i class="fa fa-trash fa-3x" />
          <h4 class="heading mt-4">
            Você realmente deseja excluir a tarefa
            <span class="text-warning">
              {{ modals.modalRemoveTask.task.title }}
            </span>
            ?
          </h4>
          <p class="mt-3 mb-0">
            Todas as informações relacionadas a ela serão perdidas.
          </p>
        </div>
        <base-alert
          v-if="modals.modalRemoveTask.error"
          type="danger"
          class="text-center"
        >
          Ocorreu um erro ao remover a tarefa. Por favor, tente novamente.
        </base-alert>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="white"
          class="ml-auto"
          @click="modals.modalRemoveTask.show = false"
        >
          Voltar
        </base-button>
        <base-button type="white text-danger" @click="handleSubmitRemoveTask()">
          Confirmar exclusão
        </base-button>
      </template>
    </modal>
  </div>
</template>
<script>
import api from "@/services/api";

import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

import { Container, Draggable } from "vue-smooth-dnd";

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import vueCustomScrollbar from "vue-custom-scrollbar";
import "vue-custom-scrollbar/dist/vueScrollbar.css";

export default {
  name: "ProjetoTable",
  components: {
    "v-select": vSelect,
    Draggable,
    Container,
    quillEditor,
    vueCustomScrollbar,
  },
  props: {
    endpoint: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      model: {
        column: {
          title: "",
        },
        task: {
          column_id: "",
          title: "",
          status: "",
          description: "",
          start_date: "",
          end_date: "",
          tags: [],
          responsible: "",
        },
        tag: {
          title: "",
          color: "",
        },
      },
      permissionProject: "none",
      tags: [],
      data: [],
      participants: [],
      error: "",
      selectedTags: [],
      selectedUser: "",
      selectedUserEdit: "",
      project: "",
      tagThemes: [
        {
          title: "Azul",
          color: "primary",
        },
        {
          title: "Azul acizentada (padrão)",
          color: "default",
        },
        {
          title: "Azul clara",
          color: "info",
        },
        {
          title: "Laranja",
          color: "warning",
        },
        {
          title: "Preta",
          color: "dark",
        },
        {
          title: "Vermelha",
          color: "danger",
        },
        {
          title: "Verde",
          color: "success",
        },
      ],
      upperDropPlaceholderOptions: {
        className: "cards-drop-preview",
        animationDuration: "150",
        showOnTop: true,
      },
      dropPlaceholderOptions: {
        className: "drop-preview",
        animationDuration: "150",
        showOnTop: true,
      },
      modals: {
        modalNewTag: {
          show: false,
          error: "",
        },
        modalNewTask: {
          show: false,
          column: {},
          error: "",
        },
        modalViewTask: {
          show: false,
          task: {},
          error: "",
        },
        modalRemoveTask: {
          show: false,
          task: {},
          error: "",
        },
        modalColumn: {
          show: false,
          new: true,
          column: {
            title: "",
          },
          error: "",
        },
        modalRemoveColumn: {
          show: false,
          column: {},
          error: "",
        },
      },
      draggingColumn: {
        index: "",
        data: {},
      },
      draggingTask: {
        column: {},
        index: "",
        data: {},
      },
      editorEdittable: {
        placeholder:
          "Escreva aqui... (lembre-se, se necessário, você pode linkar arquivos pelo editor)",
      },
      editorReadOnly: {
        placeholder: "Nenhuma descrição adicionada",
        readOnly: true,
        theme: "bubble",
      },
      route_role: "",
      hasSelectedTag: false,
      filterByName: (option, label, search) => {
        const temp = search.toLowerCase();
        return option.name.toLowerCase().indexOf(temp) > -1;
      },
      filterByTitle: (option, label, search) => {
        const temp = search.toLowerCase();
        return option.title.toLowerCase().indexOf(temp) > -1;
      },
    };
  },
  computed: {
    validModel() {
      return (
        !this.model.task.title || !this.model.task.status || !this.selectedUser
      );
    },
    validModal() {
      return (
        !this.modals.modalViewTask.task.title ||
        !this.modals.modalViewTask.task.status ||
        !this.selectedUserEdit
      );
    },
  },
  watch: {
    "$route.params.id": async function () {
      if (this.endpoint) {
        const map = {
          diretoria: "admin",
          professor: "teacher",
          voluntario: "volunteer",
        };
        this.route_role = map[this.endpoint];
      }
      await this.loadColumns(true, true);
      this.modals.modalViewTask.show = false;
    },
  },
  async mounted() {
    if (this.endpoint) {
      const map = {
        diretoria: "admin",
        professor: "teacher",
        voluntario: "volunteer",
      };
      this.route_role = map[this.endpoint];
    }
    await this.loadColumns(true, true);
  },
  methods: {
    async loadGetPermission() {
      const loader = this.$loading.show({
        container: this.$refs.tasks_list,
        width: 90,
        height: 90,
      });
      try {
        const { data } = await api.get(
          `/collaborator/projects/${this.project.parent_project_id}/get-permission`
        );
        if (data) this.permissionProject = data.permission;
        loader.hide();
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao recuperar a permission");
      }
    },
    async loadColumns(loadTags, loadUsers) {
      const loader = this.$loading.show({
        container: this.$refs.project_task,
        width: 90,
        height: 90,
      });
      try {
        if (loadTags) await this.loadTagList();
        const { data } = await api.get(
          `/${this.route_role}/projects/${this.$route.params.id}/columns`
        );
        data.columns.forEach((col) => {
          col.tasks.forEach((tarefa) => {
            tarefa.tags.forEach((tag) => {
              const found = this.tags.find((t) => t.id === tag.project_tag_id);
              if (found) {
                tag.color = found.color;
                tag.title = found.title;
              }
            });
          });
        });
        this.project = data;
        if (loadUsers) await this.loadUsersList();
        loader.hide();
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao recuperar os projetos");
      }
    },
    async loadTagList() {
      try {
        const { data } = await api.get(
          `/${this.route_role}/projects/${this.$route.params.id}/tags`
        );
        this.tags = data;
        for (const tag of this.tags) {
          tag.selected = false;
        }
      } catch (e) {
        this.error = "Ocorreu um erro ao recuperar as tags do projeto.";
        this.$toasted.error("Erro ao recuperar as informações");
      }
    },
    async loadUsersList() {
      const loader = this.$loading.show({
        container: this.$refs.project_task,
        width: 150,
        height: 150,
        opacity: 0,
      });
      try {
        const { data } = await api.get(
          `/${this.route_role}/projects/${this.$route.params.id}/participants`
        );
        if (data.length) this.participants = data;
      } catch (e) {
        this.$toasted.error(
          "Ocorreu um erro ao recuperar a lista de usuários do projeto."
        );
      } finally {
        loader.hide();
      }
    },
    async handleSubmitNewColumn() {
      this.modals.modalColumn.error = false;
      this.error = "";
      this.modals.modalColumn.column.title =
        this.modals.modalColumn.column.title.trim();
      const loader = this.$loading.show({
        container: this.$refs.modal_new_column,
        width: 160,
        height: 160,
        opacity: 0,
      });
      try {
        const columnData = this.modals.modalColumn.column;
        const { data } = await api.post(
          `/${this.route_role}/projects/${this.$route.params.id}/columns`,
          columnData
        );
        this.modals.modalColumn.show = false;
        this.modals.modalColumn.column.title = "";
        this.$toasted.show("Nova coluna cadastrada com sucesso");
        this.project.columns = [...this.project.columns, data];
      } catch (e) {
        const genericError =
          "Ocorreu um erro ao cadastrar a coluna. Por favor, tente novamente.";
        const hasErrorResponseData = e.response && e.response.data;
        let customError = genericError;
        if (hasErrorResponseData) {
          const data = e.response.data.error
            ? e.response.data.error
            : e.response.data.errors;
          if (data[0] && data[0].message) customError = data[0].message;
          else if (data.message) customError = data.message;
        }
        this.modals.modalColumn.error = hasErrorResponseData
          ? customError
          : genericError;
        this.$toasted.error("Ocorreu um erro ao cadastrar a coluna.");
      }
      loader.hide();
    },
    async handleSubmitUpdateColumn() {
      this.modals.modalColumn.error = false;
      if (!this.modals.modalColumn.column.title) {
        this.$toasted.error(
          "Por favor, preencha o título (obrigatório) antes de continuar."
        );
        return;
      }
      const loader = this.$loading.show({
        container: this.$refs.modal_new_column,
        width: 160,
        height: 160,
        opacity: 0,
      });
      try {
        const columnData = this.modals.modalColumn.column;
        await api.put(
          `/${this.route_role}/projects/${this.$route.params.id}/columns/${columnData.id}`,
          columnData
        );
        this.project.columns.find((c) => c.id === columnData.id).title =
          columnData.title;
        this.modals.modalColumn.show = false;
        this.modals.modalColumn.column.title = "";
        this.$toasted.show("Informações atualizadas com sucesso");
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao salvar as informações");
        this.modals.modalColumn.error =
          "Ocorreu um erro ao atualizar a coluna. Por favor, tente novamente.";
      }
      loader.hide();
    },
    async handleSubmitRemoveColumn() {
      this.modals.modalRemoveColumn.error = false;
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation_delete_column,
        width: 160,
        height: 160,
        opacity: 0,
      });
      try {
        const column_id = this.modals.modalRemoveColumn.column.id;
        await api.delete(
          `/${this.route_role}/projects/${this.$route.params.id}/columns/${column_id}`
        );
        this.modals.modalRemoveColumn.show = false;
        this.modals.modalRemoveColumn.column = "";
        const index = this.project.columns.findIndex((c) => c.id === column_id);
        this.project.columns.splice(index, 1);
        this.$toasted.show("Coluna removida com sucesso");
      } catch (e) {
        this.modals.modalRemoveColumn.error = true;
        this.$toasted.error("Ocorreu um erro ao remover a coluna");
      } finally {
        loader.hide();
      }
    },
    async handleSubmitNewTag() {
      this.modals.modalNewTag.error = "";
      const loader = this.$loading.show({
        container: this.$refs.modal_new_tag,
        width: 160,
        height: 160,
        opacity: 0,
      });
      try {
        const tag = this.model.tag;
        const { data } = await api.post(
          `/${this.route_role}/projects/${this.project.id}/tags`,
          tag
        );
        this.tags.push(data);
        this.$toasted.show("Nova tag cadastradra com sucesso.");
        this.model.tag.title = "";
        this.model.tag.color = "";
      } catch (e) {
        this.modals.modalNewTag.error = true;
        this.$toasted.error("Ocorreu um erro ao cadastrar a tag.");
        const genericError = "Ocorreu um erro ao cadastrar a tag.";
        const hasErrorResponseData = e.response && e.response.data;
        let customError = genericError;
        if (hasErrorResponseData) {
          const data = e.response.data.error
            ? e.response.data.error
            : e.response.data.errors;
          if (data[0] && data[0].message) customError = data[0].message;
          else if (data.message) customError = data.message;
        }
        this.$toasted.error(hasErrorResponseData ? customError : genericError);
      }
      loader.hide();
    },
    async handleSubmitNewTask() {
      this.modals.modalNewTask.error = "";
      const loader = this.$loading.show({
        container: this.$refs.modal_new_task,
        width: 160,
        height: 160,
        opacity: 0,
      });
      try {
        const task = Object.assign({}, this.model.task);
        task.column_id = this.modals.modalNewTask.column.id;
        task.tags = this.tags;
        delete task.responsible;
        const { data } = await api.post(
          `/${this.route_role}/projects/${this.project.id}/tasks`,
          task
        );
        this.$toasted.show("Nova tarefa cadastradra com sucesso.");
        this.modals.modalNewTask.show = false;
        data.tags.forEach((tag) => {
          const found = this.tags.find((t) => t.id === tag.project_tag_id);
          if (found) {
            tag.color = found.color;
            tag.title = found.title;
          }
        });
        this.project.columns
          .find((c) => c.id === task.column_id)
          .tasks.push(data);
      } catch (e) {
        const genericError =
          "Ocorreu um erro ao cadastrar a tarefa. Por favor, tente novamente.";
        const hasErrorResponseData = e.response && e.response.data;
        let customError = genericError;
        if (hasErrorResponseData) {
          const data = e.response.data.error
            ? e.response.data.error
            : e.response.data.errors;
          if (data[0] && data[0].message) customError = data[0].message;
          else if (data.message) customError = data.message;
        }
        this.modals.modalNewTask.error = hasErrorResponseData
          ? customError
          : genericError;
        this.$toasted.error("Ocorreu um erro ao cadastrar a tarefa.");
      }
      loader.hide();
    },
    async handleSubmitUpdateTask() {
      this.modals.modalViewTask.error = "";
      if (
        !this.modals.modalViewTask.task.title ||
        !this.modals.modalViewTask.task.status
      ) {
        this.$toasted.error(
          "Por favor, informe o título e o status (obrigatórios) antes de continuar."
        );
        return;
      }
      const loader = this.$loading.show({
        container: this.$refs.modal_view_task,
        width: 160,
        height: 160,
        opacity: 0,
      });
      try {
        const task = Object.assign({}, this.modals.modalViewTask.task);
        task.tags = this.tags;
        delete task.responsible;
        const { data } = await api.put(
          `/${this.route_role}/projects/${this.project.id}/tasks/${task.id}`,
          task
        );
        this.$toasted.show("Tarefa atualizada com sucesso.");
        this.modals.modalViewTask.show = false;

        data.tags.forEach((tag) => {
          const found = this.tags.find((t) => t.id === tag.project_tag_id);
          if (found) {
            tag.color = found.color;
            tag.title = found.title;
          }
        });

        const index = this.project.columns
          .find((c) => c.id === task.column_id)
          .tasks.findIndex((t) => t.id === task.id);
        this.project.columns
          .find((c) => c.id === task.column_id)
          .tasks.splice(index, 1, data);
      } catch (e) {
        this.modals.modalViewTask.error =
          "Ocorreu um erro ao atualizar a tarefa. Por favor, tente novamente.";
        this.$toasted.error("Ocorreu um erro ao salvar as informações");
      }
      loader.hide();
    },
    async handleSubmitRemoveTask() {
      this.modals.modalRemoveTask.error = "";
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation_delete_task,
        width: 160,
        height: 160,
        opacity: 0,
      });
      try {
        const task_id = this.modals.modalRemoveTask.task.id;
        await api.delete(
          `/${this.route_role}/projects/${this.project.id}/tasks/${task_id}`
        );
        this.modals.modalRemoveTask.column = "";
        this.modals.modalRemoveTask.show = false;
        this.modals.modalViewTask.show = false;
        const index = this.project.columns
          .find((c) => c.id === this.modals.modalRemoveTask.task.column_id)
          .tasks.findIndex((t) => t.id === task_id);
        this.project.columns
          .find((c) => c.id === this.modals.modalRemoveTask.task.column_id)
          .tasks.splice(index, 1);
        this.$toasted.show("Tarefa removida com sucesso");
      } catch (e) {
        this.modals.modalRemoveTask.error = true;
        this.$toasted.error("Ocorreu um erro ao remover a tarefa");
      } finally {
        loader.hide();
      }
    },
    async handleOpenModalViewTask(task) {
      task.start_date = task.start_date
        ? this.moment(task.start_date).format("YYYY-MM-DD")
        : "";
      task.end_date = task.end_date
        ? this.moment(task.end_date).format("YYYY-MM-DD")
        : "";
      this.modals.modalViewTask.task = Object.assign({}, task);
      this.handleDeselectTag();
      this.hasSelectedTag = false;
      this.tags.forEach((tag) => {
        const found = task.tags.find((t) => t.project_tag_id === tag.id);
        if (found) {
          tag.selected = true;
          this.hasSelectedTag = true;
        }
      });
      const user = this.participants.find(
        (user) =>
          user.participant_id === this.modals.modalViewTask.task.responsible_id
      );
      this.selectedUserEdit = user ? user : "";
      this.modals.modalViewTask.show = true;
    },
    async handleUpdateOrder(item) {
      const loader = this.$loading.show({
        container: this.$refs.project_task,
        width: 90,
        height: 90,
        opacity: 0,
      });
      try {
        const url = `/${this.route_role}/projects/${this.$route.params.id}/${
          item === "column" ? "columns" : "tasks"
        }/order`;
        await api.put(url, this.project);
        //this.$toasted.show("Salvo com sucesso");
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao salvar");
      } finally {
        loader.hide();
      }
    },
    handleOpenModalNewTask(column) {
      this.handleDeselectTag();
      this.model.task = {
        column_id: "",
        title: "",
        status: "",
        description: "",
        start_date: "",
        end_date: "",
        tags: [],
        responsible: "",
      };
      this.selectedUser = "";
      this.modals.modalNewTask.error = "";
      this.modals.modalNewTask.column = column;
      this.modals.modalNewTask.show = true;
    },
    handleOpenModalColumn(column, new_column) {
      this.modals.modalColumn.error = "";
      this.modals.modalColumn.new = new_column;
      if (column) Object.assign(this.modals.modalColumn.column, column);
      else {
        this.modals.modalColumn.column = {
          title: "",
        };
      }
      this.modals.modalColumn.show = true;
    },
    handleOpenModalRemoveColumn(column) {
      this.modals.modalRemoveColumn.column = column;
      this.modals.modalRemoveColumn.error = "";
      this.modals.modalRemoveColumn.show = true;
    },
    handleOpenModalRemoveTask(task) {
      this.modals.modalRemoveTask.task = task;
      this.modals.modalRemoveTask.show = true;
    },
    truncate(text, stop = 30, clamp = "...") {
      if (!text) return "N/A";
      return text.slice(0, stop) + (stop < text.length ? clamp : "");
    },
    handleSelectResponsible() {
      if (!this.selectedUser) {
        this.model.task.responsible = "";
        return;
      }
      this.model.task.responsible_id = this.selectedUser.participant_id;
    },
    handleSelectResponsibleEdit() {
      if (!this.selectedUserEdit) {
        this.modals.modalViewTask.task.responsible_id = "";
        return;
      }
      this.modals.modalViewTask.task.responsible_id =
        this.selectedUserEdit.participant_id;
    },
    handleDeselectTag() {
      this.tags.forEach((tag) => {
        tag.selected = false;
      });
    },
    dragStartColumn(dragResult) {
      const { payload, isSource } = dragResult;
      if (isSource) {
        this.draggingColumn = {
          index: payload,
          data: this.project.columns[payload],
        };
      }
    },
    async onDropColumn(dropResult) {
      const { removedIndex, addedIndex } = dropResult;
      if (removedIndex === addedIndex) {
        return;
      } else {
        if (removedIndex !== null) {
          this.project.columns.splice(removedIndex, 1);
        }
        if (addedIndex !== null) {
          this.project.columns.splice(addedIndex, 0, this.draggingColumn.data);
        }
        this.project.columns.map((column, index) => {
          column.order = index + 1;
          return column;
        });
        await this.handleUpdateOrder("column");
      }
    },
    dragStartTask(column, dragResult) {
      const { payload, isSource } = dragResult;
      if (isSource) {
        this.draggingTask = {
          index: payload,
          data: this.project.columns[column].tasks[payload],
        };
      }
    },
    async onDropTask(column, dropResult) {
      const { removedIndex, addedIndex } = dropResult;
      if (column === this.draggingTask.column && removedIndex === addedIndex) {
        return;
      } else {
        if (removedIndex !== null) {
          this.project.columns[column].tasks.splice(removedIndex, 1);
        }
        if (addedIndex !== null) {
          this.project.columns[column].tasks.splice(
            addedIndex,
            0,
            this.draggingTask.data
          );
          this.project.columns.map(function (column) {
            column.tasks.map(function (task, index) {
              task.column_id = column.id;
              task.order = index + 1;
              return task;
            });
          });
          await this.handleUpdateOrder("task");
        }
      }
    },
    getChildPayload(index) {
      return index;
    },
    setCurrentDate(isNewTask) {
      isNewTask
        ? (this.model.task.start_date = this.moment().format("YYYY-MM-DD"))
        : (this.modals.modalViewTask.task.start_date =
            this.moment().format("YYYY-MM-DD"));
    },
  },
};
</script>
<style scoped>
.display-inline {
  overflow-x: scroll;
  overflow-y: auto;
  white-space: nowrap;
}
.display-inline ::-webkit-scrollbar {
  width: 2px;
}
.scroll-column {
  overflow-y: auto;
  max-height: 600px;
}

.scroll-column ::-webkit-scrollbar {
  width: 2px;
}

.cursor {
  cursor: pointer;
}
.collaborator-image {
  border-radius: 50px;
  max-width: 40px;
  width: 100%;
  margin-right: 20px;
}
.table-container {
  min-height: 150px;
}
.column-project {
  width: 350px;
  border: "1px solid black";
  margin-bottom: 20px;
}
.task-project {
  height: 100%;
}
.cards-drop-preview {
  background-color: rgba(150, 150, 200, 0.1);
  border: 1px dashed #abc;
  margin: 5px 45px 5px 5px;
}
.drop-preview {
  background-color: rgba(150, 150, 200, 0.1);
  border: 1px dashed #abc;
  margin: 5px;
}
.new-item:hover {
  background: rgba(150, 150, 200, 0.1);
  border-radius: 6px;
}
.add-responsible {
  border-radius: 50%;
  background-color: rgba(150, 150, 200, 0.1);
}
.add-responsible:hover {
  background-color: rgba(150, 150, 200, 0.3);
}
.task-info {
  font-size: 80%;
}
#scrollable {
  overflow-x: auto;
}
</style>
<style>
p > strong {
  font-weight: bold !important;
}
.np-container-edditable .quill-editor .ql-container,
.np-container-edditable .quill-editor .ql-container .ql-editor {
  height: 8rem;
  width: 100%;
}
.responsible_select.v-select {
  background-color: #fff;
  background-clip: padding-box;
}
.responsible_select.v-select .vs__dropdown-toggle {
  padding: 0.5rem 0.1rem;
}
.responsible_select.v-select
  .vs__dropdown-toggle
  .vs__selected-options
  .vs__search {
  color: #8898aa;
  font-weight: 400;
  line-height: 1.5;
  font-size: 0.875rem;
}
</style>
