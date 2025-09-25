<template>
  <div>
    <!-- Top row: Search + Buttons -->
    <v-row class="mb-4" align="center">
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="filter"
          label="Search (name, email, city)"
          clearable
        />
      </v-col>
      <v-col cols="12" sm="6" class="text-right">
        <v-btn @click="reload" class="ma-0">Reload data</v-btn>
        <v-btn color="primary" @click="openFetchDialog">Fetch more</v-btn>
      </v-col>
    </v-row>

    <!-- Data table -->
    <v-data-table
      :headers="headers"
      :items="pagedItems"
      item-key="uuid"
      class="elevation-1"
    >
      <template #item.action="{ item }">
        <v-btn small @click="openEdit(item)">Edit</v-btn>
      </template>
    </v-data-table>

    <!-- Pagination -->
    <div class="d-flex justify-center mt-4">
      <v-pagination v-model="page" :length="totalPages" />
      <v-select
        class="ml-4"
        :items="itemsPerPageOptions"
        v-model="itemsPerPage"
        dense
        hide-details
        label="Rows"
        style="width: 120px"
      />
    </div>

    <!-- Edit Dialog -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>Edit user</v-card-title>
        <v-card-text>
          <v-form ref="formRef" v-model="valid">
            <v-text-field
              v-model="edited.name"
              label="Name"
              :rules="[(v) => !!v || 'Name required']"
            />
            <v-text-field
              v-model="edited.email"
              label="Email"
              :rules="[
                (v) => !!v || 'Email required',
                (v) => /.+@.+\..+/.test(v) || 'Email invalid',
              ]"
            />
            <v-text-field v-model="edited.city" label="City" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" :disabled="!valid" @click="saveEdit"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Fetch dialog -->
    <v-dialog v-model="fetchDialog" max-width="400">
      <v-card>
        <v-card-title>Fetch from RandomUser</v-card-title>
        <v-card-text>
          <v-text-field
            v-model.number="fetchCount"
            type="number"
            label="How many records to fetch"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="fetchDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="performFetch">Fetch</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import axios from "axios";

// Make sure your .env has VITE_API_URL=http://localhost:5001
const API = import.meta.env.VITE_API_URL || "http://localhost:5001";

// Table headers
const headers = [
  { text: "Name", value: "name" },
  { text: "Email", value: "email" },
  { text: "City", value: "city" },
  { text: "Action", value: "action", sortable: false },
];

// Reactive state
const items = ref([]);
const filter = ref("");
const page = ref(1);
const itemsPerPage = ref(25);
const itemsPerPageOptions = [10, 25, 50, 100];

const dialog = ref(false);
const edited = reactive({ uuid: "", name: "", email: "", city: "" });
const valid = ref(true);
const formRef = ref(null);

const fetchDialog = ref(false);
const fetchCount = ref(100);

// Fetch users from backend
async function loadAll() {
  try {
    const res = await axios.get(`${API}/api/users`);
    items.value = res.data.users || [];
    console.log(res.data);
  } catch (err) {
    console.error("Load users failed:", err);
    items.value = []; // make sure table doesn't break
  }
}

function reload() {
  loadAll();
}

// On component mount, load data
onMounted(() => {
  loadAll();
});

// Filtered and paginated items
const filtered = computed(() => {
  const q = filter.value && filter.value.toLowerCase();
  if (!q) return items.value;
  return items.value.filter((u) => {
    return (
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.city || "").toLowerCase().includes(q)
    );
  });
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / itemsPerPage.value))
);

const pagedItems = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  return filtered.value.slice(start, start + itemsPerPage.value);
});

// Edit user
function openEdit(item) {
  edited.uuid = item.uuid;
  edited.name = item.name;
  edited.email = item.email;
  edited.city = item.city;
  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
}

async function saveEdit() {
  if (formRef.value) await formRef.value.validate?.();
  if (!edited.name || !edited.email) return;
  try {
    const body = { name: edited.name, email: edited.email, city: edited.city };
    await axios.put(`${API}/api/users/${edited.uuid}`, body);
    const idx = items.value.findIndex((i) => i.uuid === edited.uuid);
    if (idx !== -1) items.value[idx] = { ...items.value[idx], ...body };
    dialog.value = false;
  } catch (err) {
    console.error("Update failed:", err);
  }
}

// Fetch more users from RandomUser API
function openFetchDialog() {
  fetchDialog.value = true;
}

async function performFetch() {
  try {
    await axios.post(`${API}/api/users/fetch`, { count: fetchCount.value });
    fetchDialog.value = false;
    await loadAll();
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}
</script>
