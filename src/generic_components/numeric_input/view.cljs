(ns generic-components.numeric-input.view
  (:require
   [reagent.core :as r]
   [clojure.spec.alpha :as s]

  ;;  [clojure.test.check.generators]
  ;;  [clojure.test.check.properties]
  ;;  [clojure.test.check]
   [clojure.spec.test.alpha :as stest]
   ))

(s/def ::input-attr map?)
(s/def ::message-attr map?)

(s/def ::placeholder string?)

(s/def ::display-value string?)
(s/def ::message string?)
(s/def ::is-valid boolean?)
(s/def ::is-disabled boolean?)

;todo having s/fspec causes clojure to test via generation...
(s/def ::handle-change fn?)
;; (s/def ::handle-change
;;   (s/fspec
;;    :args (s/cat :val (s/or :string string? :nil nil?))
;;    :ret any?))

(s/def ::handle-blur fn?)
;; (s/def ::handle-blur
;;   (s/fspec
;;    :args (s/cat :val (s/or :string string? :nil nil?))
;;    :ret any?))

(s/def ::props (s/keys :req-un [::display-value
                                ::is-valid
                                ::handle-blur
                                ::handle-change]
                       :opt-un [::input-attr
                                ::message-attr
                                ::message
                                ::placeholder
                                ::is-disabled]))

;; (defn verify [spec val]
;;   (if-not (s/valid? spec val)
;;     (println (s/explain spec val))))

(defn numeric-input [props]
  ;todo why doesn't this work?
  ;{:pre [(verify ::props props)]}
  ;{:pre [(s/valid? ::props props)]}
  ;(println props)
  ;(verify ::props props)
  [:<>
   [:input (merge
            (:input-attr props)
            (select-keys props [:placeholder])
            {:class (r/class-names [(-> props :input-attr :class)
                                    (when
                                     (= false (:is-valid props))
                                      "invalid")])
             :value (:display-value props)
             :on-change #((:handle-change props) (-> % .-target .-value))
             :on-blur #((:handle-blur props) (-> % .-target .-value))}
            (when (::is-disabled props) {:disabled true}))]
   (when-let [message (:message props)]
     [:div (:message-attr props) message])])

(s/fdef numeric-input
  :args (s/cat :props ::props)
  :ret any?)

(stest/instrument `numeric-input)

;; (numeric-input {:display-value "5"
;;                 :is-valid true
;;                 :handle-change :default
;;                 :handle-blur :default})