<template>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-button>
        <ion-icon slot="icon-only" :icon="shareOutline"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-title slot='secondary'>My Yachts</ion-title>
    <ion-buttons slot="end">
      <ion-button>
        <ion-icon slot="icon-only" :icon="optionsOutline"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
  <ion-content :fullscreen="true" class="ion-padding">
    <ion-searchbar class='search' show-clear-button="always" placeholder='Search Yachts'></ion-searchbar>
  <div class='container'>
    <div> Add Yachts </div>
    <ion-icon slot="icon-only" :icon="addCircleOutline"></ion-icon>
  </div>
  </ion-content>
  <ion-footer class="ion-no-border">
    <ion-toolbar>
      <ion-title>Footer</ion-title>
    </ion-toolbar>
  </ion-footer>
</template>

<script lang="ts">
import { IonSearchbar, IonContent, IonButton, IonButtons, IonIcon, IonTitle, IonToolbar, IonFooter } from '@ionic/vue';
import { shareOutline, optionsOutline, trashBin, addCircleOutline } from 'ionicons/icons';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { IonButton, IonContent,
    IonButtons, IonIcon, IonTitle, IonToolbar, IonSearchbar, IonFooter },
  setup() {
    return { optionsOutline, shareOutline, trashBin, addCircleOutline };
  },
});
</script>
<style lang='scss'>
.container {
  border-radius: 2px;
  border: dashed 1px;
  height: 300px;
  width: 300px;
  margin: 10px;
}
.search {
  width: 320px;
}
</style>
