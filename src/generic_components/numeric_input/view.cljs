(ns generic-components.numeric-input.view
  (:require
   [reagent.core :as r]
   [clojure.spec.alpha :as s]

   [clojure.spec.test.alpha :as stest]
   ))

(s/def ::input-attr map?)
(s/def ::messages-attr map?)

(s/def ::placeholder string?)

(s/def ::display-value string?)
(s/def ::messages (s/coll-of string?))
(s/def ::is-valid boolean?)
(s/def ::is-disabled boolean?)

(s/def ::handle-change fn?)
(s/def ::handle-blur fn?)

(s/def ::props (s/keys :req-un [::display-value
                                ::is-valid
                                ::handle-blur
                                ::handle-change]
                       :opt-un [::input-attr
                                ::messages-attr
                                ::messages
                                ::placeholder
                                ::is-disabled]))

(defn numeric-input [^::props props]
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
   (when-let [messages (:messages props)]
     [:div (:message-attr props)
      (for [message messages]
        ^{:key message} [:div message])])])

(s/fdef numeric-input
  :args (s/cat :props ::props)
  :ret any?)

(stest/instrument `numeric-input)
