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
        <select @change="changeStation()" v-model="station" name="cars" id="cars">
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
          <span>{{ lastDate }}</span>
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
    <div class="graphContainer">
      <div class="dataFilter">
        <input type="date" v-model="filter.dateStart" /> até
        <input type="date" v-model="filter.dateEnd" />
        <button id="getHistoryButton" type="button" @click="getHistory()">Buscar</button>
      </div>
      <div class="graph">
        <GChart type="ColumnChart" :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script>
import { firebase } from "../../firebaseCredentiais";
import { convertDate } from "../util/date";
import { GChart } from "vue-google-charts";
export default {
  name: "Index",
  components: {
    GChart,
  },
  data() {
    return {
      filter: {},
      stations: [],
      station: {},
      level: 0,
      lastDate: "",
      chartData: [
        ["Nível", "01", "02", "03"],
        ["15-03-2021", 1, 0, 3],
        ["16-03-2021", 0, 3, 2],
        ["20-03-2021", 2, 1, 0],
        ["21-03-2021", 1, 2, 3],
      ],
      chartOptions: {
        chart: {
          title: "Níveis da estação",
          subtitle: "Níveis medidos no período",
        },
        colors: ["#099cf1", "#ffd900", "#ff0000"],
      },
    };
  },
  computed: {},
  methods: {
    changeStation() {
      this.level = 0;
      this.getLevels();
    },
    async getStations() {
      var res = await firebase.firestore().collection("stations").get();
      var st = [];
      res.forEach((doc) => {
        st.push(doc.data());
      });
      this.stations = st;
      this.station = st[0];
      this.getLevels();
    },
    getLevels() {
      var query = firebase
        .firestore()
        .collection("stations")
        .doc(this.station.id)
        .collection("levels")
        .orderBy("date", "desc")
        .limit(1);
      query.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          var level = change.doc.data();
          this.level = level.level;
          this.lastDate = level.dateFormated;
        });
      });
    },
    async getHistory() {
      const dateEn = await convertDate(new Date().getTime(), "time", "en", "-");
      const start = new Date(`${dateEn} 00:01:00`).getTime();
      const end = new Date(`${dateEn} 23:59:00`).getTime();
      const res = await firebase
        .firestore()
        .collection("stations")
        .doc(this.station.id)
        .collection("levels")
        .where("date", ">=", start)
        .where("date", "<=", end)
        .get();
      const result = [];
      result[0] = ["Nível", "01", "02", "03"];
      res.forEach((doc) => {
        var level = [doc.data().dateFormated];
        res.docs.map((item) => {
          if (item.data().dateFormated == level[0]) {
            level.push(item.data().level);
          }
        });
        console.log("level", level);
        result.push(level);
      });
      console.log("result", result);
    },
  },
  beforeMount() {
    this.getStations();
  },
  mounted() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
