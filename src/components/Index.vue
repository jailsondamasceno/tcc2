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
    <div class="graphContainer shadow">
      <div class="title">
        <span>Histórico desta estação.</span>
      </div>
      <div class="dataFilter">
        <input type="date" v-model="filter.dateStart" /> até
        <input type="date" v-model="filter.dateEnd" />
      </div>
      <button id="getHistoryButton" type="button" @click="getHistory()">Buscar</button>
      <div class="graph">
        <GChart type="ColumnChart" :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script>
import { firebase } from "../../firebaseCredentiais";
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
        ["", 0, 0, 0],
        ["", 0, 0, 0],
        ["", 0, 0, 0],
        ["", 0, 0, 0],
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
      const start = new Date(`${this.filter.dateStart} 00:01:00`).getTime();
      const end = new Date(`${this.filter.dateEnd} 23:59:00`).getTime();
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
      const response = [];

      res.forEach((doc) => {
        response.push({ ...doc.data() });
      });

      var level = {};
      response.forEach((doc) => {
        level[doc.dateFormated] = { date: doc.dateFormated };
        level[doc.dateFormated].levels = [];
      });

      response.map((l) => {
        level[l.dateFormated].levels.push(l.level);
      });

      var level2 = Object.values(level);

      var level3 = level2.map((lv) => {
        var item = lv.levels;

        if (!item.includes(3)) {
          item.splice(2, 0, 0);
        }
        if (!item.includes(2)) {
          item.splice(1, 0, 0);
        }
        if (!item.includes(1)) {
          item.splice(0, 0, 0);
        }

        item.splice(0, 0, lv.date);
        return item;
      });

      level3.forEach((e) => {
        result.push(e);
      });

      this.chartData = result;
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
