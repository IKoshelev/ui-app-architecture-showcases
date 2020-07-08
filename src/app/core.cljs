(ns app.core
  (:require
   
   [reagent.core :as r]
   [reagent.dom  :as rdom]

   [generic-components.numeric-input.view :refer [numeric-input] ]
   ))

;;todo research loading css via webpack

(defn root []
  (let [input-val (r/atom "dv")]
    (fn [] [:div#app-root
     [:div.main-logo "Welcome to Crazy Ivan Motors"]
     [:div.screens
      [numeric-input {:display-value (or @input-val "") ;todo how do we get nil here?
                      :is-valid true
                      :handle-change #(reset! input-val %)
                      :handle-blur #(reset! input-val %)}]]])))

(defn ^:dev/after-load start []
  (rdom/render
   [root]

   (js/document.getElementById "app")

   (fn []
     (js/console.log "rendered app"))))

(defn ^:export init []
  (start))