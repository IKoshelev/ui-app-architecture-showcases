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

;;todo research loading css via webpack

(defn ^:dev/after-load start []
  (rdom/render

   [:div#app-root
    [:div.main-logo "Welcome to Crazy Ivan Motors"]
    [:div.screens]]

   (js/document.getElementById "app")

   (fn []
     (js/console.log "rendered app"))))

(defn ^:export init []
  (start))


