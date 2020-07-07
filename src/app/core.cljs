(ns app.core
  (:require
   [cljs.core.async :refer [go]]
   [cljs.core.async.interop :refer-macros [<p!]]

   [reagent.core :as r]
   [reagent.dom  :as rdom]
   ["react" :as react]

   ["/js/api/CarInsurance.Client.js" 
    :refer [InsurancePlanType carInsuranceClient]
    :rename {InsurancePlanType insurance-plan-type 
             carInsuranceClient car-insurance-client}]
   ;;todo make a wrapper
   ))

(println (js->clj insurance-plan-type))

(def stuff (go (let
                [resp (try
                        (<p! (.getAvaliableInsurancePlans car-insurance-client))
                        (catch js/Error err (println "Ooops, promise had an error" err))
                        (finally (println "Promise pipe done")))]
                 (-> resp js->clj println)
                 resp)))

(defonce perpetual-count (r/atom 0))

(defn Counter [external-counter]
  (js/console.log "renderning Counter")
  (let [count (or external-counter (r/atom 0))]
    (fn [] [:<>
            [:div (str "I'm a counter of " @count)]
            [:button {:on-click #(swap! count inc)} "+1"]])))

(defn Counter2 []
  (let [[count set-count!] (react/useState 0)]
    (r/as-element
     [:div
      [:p "You clicked " count " times"]
      [:button
       {:on-click #(set-count! inc)}
       "Click"]])))


(defn ^:dev/after-load start []
  (rdom/render

   [:<>
    [:div "Starting div"]
    [Counter]
    [Counter]
    [Counter perpetual-count]
    [:> Counter2]]

   (js/document.getElementById "app")

   (fn []
     (js/console.log "rendered app"))))

(defn ^:export init []
  (start))


