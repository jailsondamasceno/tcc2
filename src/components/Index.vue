<template>
  <div class="index">
    <div class="title">
      <span>Estações de monitoramento de pontos com risco de alagamentos</span>
    </div>
    <div class="station">
      <div class="info">
        <h4>{{ station.name }}</h4>
        <h6>{{ station.address }}</h6>
      </div>
      <div class="stations">
        <select v-model="station" name="cars" id="cars">
          <option selected>Selecione a estação</option>
          <option v-for="(sta, index) in stations" :key="sta + index" :value="sta">
            {{ sta.name }}
          </option>
        </select>
      </div>
    </div>
    <div class="resultContainer">
      <div class="result">
        <div class="date">
          <span>{{lastDate}}</span>
        </div>
        <div :class="`${level == 3 ? 'danger' : 'level-inactive'}`">
          <span class="material-icons" :style="`${level == 3 ? 'color:red;' : ''}`"
            >pool</span
          >
          <p>Perigo eminente. Evite este local a qualquer custo.</p>
        </div>
        <div :class="`${level == 2 ? 'hight' : 'level-inactive'}`">
          <span
            class="material-icons"
            :style="`${level == 2 ? 'color:rgb(255, 217, 0);' : ''}`"
            >warning</span
          >
          <p>
            Este local está muito alagado e pode oferecer alto risco. Evite passar nesta
            região.
          </p>
        </div>
        <div :class="`${level == 1 ? 'low' : 'level-inactive'}`">
          <span
            class="material-icons"
            :style="`${level == 1 ? 'color:rgb(9, 157, 243);' : ''}`"
            >priority_high</span
          >
          <p>
            Chove muito neste local e já começa a causar alamentos. Se puder evitar,
            escolha outro caminho.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { firebase } from "../../firebase";
export default {
  name: "Index",
  data() {
    return {
      stations: [
        {
          id: "01",
          name: "Estação João Dias 01",
          address: "Avenida João Dias 2025",
        },
        {
          id: "02",
          name: "Estação Marginal Pinheiros 01",
          address: "Marginal Pinheiros 3200",
        },
      ],
      station: {
        id: "01",
        name: "Estação João Dias 01",
        address: "Avenida João Dias 2025",
      },
      level: 0,
      lastDate:''
    };
  },
  computed: {},
  methods: {
    getLeves() {
      var query = firebase.firestore().collection("levels").limit(5);
      query.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          var level = change.doc.data();          
          this.level = level.level;
          this.lastDate = level.dateFormated;
        });
      });
    },
  },
  mounted() {
    this.getLeves();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
