let db = firebase.firestore();
let blocksRef = db.collection('blocks');


Vue.component("block", {
  props: ["block"],
  data() {
    return {
      isHidden: true
    }
  },
  computed: {
    apartment() {
      return this.block.type == "apartment";
    },
    road() {
      return this.block.type == "road";
    },
    greenlight() {
      return this.block.type == "light" && this.block.color == true;
    },
    redlight() {
      return this.block.type == "light" && this.block.color == false;
    },
    
  },
  template: `
      <div v-if="apartment" class="blue" v-on:click="isHidden = !isHidden"> <p  v-if="!isHidden">{{this.block.name}}</p> </div>
      <div v-else-if="road" class="white" v-on:click="isHidden = !isHidden"> <p  v-if="!isHidden">{{this.block.name}}</p> </div>
      <div v-else-if="greenlight" class="yellow" v-on:click="isHidden = !isHidden"> <p  v-if="!isHidden">{{this.block.color}}</p> </div>
      <div v-else class="red" v-on:click="isHidden = !isHidden"> <p  v-if="!isHidden">{{this.block.color}}</p> </div>
  `,
  methods: {
  }
});


Vue.component('list', {
  props: ["block"],
  template: `
    <div>
      <li>
        {{ block }}
        <button @click="deleteBlock" class="button">Delete</button>
      </li>
    </div>
  `,
  methods: {
    deleteBlock() {
      this.$emit('delete-block', this.block.id)
    }
  }
})

let app = new Vue({
  el: "#app",
  data: {
    isHidden: true,
    blocks: [],
    apartment: "",
    road: "",
    light: true,
  },
  
  
  methods:{
    addApt(){
      blocksRef.add({
        name: this.apartment,
        type: "apartment"
      })
      .then(function(doc) {
        doc.set({id: doc.id}, {merge: true});
      });
      this.reset();
      this.updateData();
    },
    
    addRoad(){
      blocksRef.add({
        name: this.road,
        type: "road"
      })
      .then(function(doc) {
        doc.set({id: doc.id}, {merge: true});
      });
      this.reset();
      this.updateData();
    },
    
    addLight(){
      blocksRef.add({
        color: this.light,
        type: "light"
      })
      .then(function(doc) {
        doc.set({id: doc.id}, {merge: true});
      });
      this.reset();
      this.updateData();
    },
    
    reset() {
      this.apartment = "";
      this.road = "";
    },
    
    updateData(){
      blocksRef.get().then(snapshot => {
        let blocks = [];
        snapshot.forEach(doc => {
          blocks.push(doc.data());
        });
        this.blocks = blocks;
      })
    },
    
    deleteBlock(id) {
      blocksRef.doc(id).delete();
    }
    
  },
  
  computed: {
  },
  
  
  mounted() {
    blocksRef.onSnapshot(querySnapshot => {
      let blocks = [];
      querySnapshot.forEach(doc => {
        blocks.push(doc.data());
      })
      this.blocks = blocks;
    });
  }
});
