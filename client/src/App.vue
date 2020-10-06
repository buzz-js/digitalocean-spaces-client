<template>
  <div class="container">
    <table class="table is-striped is-fullwidth is-hoverable">
      <thead>
        <tr>
          <th>Name</th>
          <th>Last Modified</th>
          <th>Size</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(file, index) in files" :key="index">
          <td>{{ file.name }}</td>
          <td>{{ file.lastModified }}</td>
          <td>{{ bytesToSize(file.size) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: () => {
    return {
      files: [],
    };
  },
  mounted() {
    axios("http://localhost:1802/api").then(({ data }) => (this.files = data));
  },
  methods: {
    bytesToSize(bytes, decimals = 2) {
      if (bytes === 0) return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    },
  },
};
</script>

<style lang="scss" scoped>
.table {
  background-color: white;
  color: #363636;
}

.table td,
.table th {
  border: 1px solid #dbdbdb;
  border-width: 0 0 1px;
  padding: 0.5em 0.75em;
  vertical-align: top;
}

.table th {
  color: #363636;
}

.table th:not([align]) {
  text-align: inherit;
}

.table thead {
  background-color: transparent;
}

.table thead td,
.table thead th {
  border-width: 0 0 2px;
  color: #363636;
}

.table tfoot {
  background-color: transparent;
}

.table tfoot td,
.table tfoot th {
  border-width: 2px 0 0;
  color: #363636;
}

.table tbody {
  background-color: transparent;
}

.table tbody tr:last-child td,
.table tbody tr:last-child th {
  border-bottom-width: 0;
}

.table.is-bordered td,
.table.is-bordered th {
  border-width: 1px;
}

.table.is-bordered tr:last-child td,
.table.is-bordered tr:last-child th {
  border-bottom-width: 1px;
}

.table.is-fullwidth {
  width: 100%;
}

.table.is-hoverable tbody tr:not(.is-selected):hover {
  background-color: #fafafa;
  cursor: pointer;
}

.table.is-hoverable.is-striped tbody tr:not(.is-selected):hover {
  background-color: #fafafa;
}

.table.is-hoverable.is-striped
  tbody
  tr:not(.is-selected):hover:nth-child(even) {
  background-color: whitesmoke;
}

.table.is-striped tbody tr:not(.is-selected):nth-child(even) {
  background-color: #fafafa;
}
</style>
