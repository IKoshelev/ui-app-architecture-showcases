(ns generic-components.numeric-input.model
  (:require

   [clojure.spec.alpha :as s]
   [clojure.spec.test.alpha :as stest]

   [clojure.test :as test]))

(s/def ::uncommited-value string?)
(s/def ::messages (s/coll-of string?))

(s/def ::model (s/keys :opt-un [::uncommited-value ::messages]))

(defn create
  ([] (create nil nil))
  ([ucnommited-value] (create ucnommited-value nil))
  ([ucnommited-value messages]
   (conj {}
         (when ucnommited-value [:uncommited-value ucnommited-value])
         (when messages [:messages messages]))))

(defn set-uncommited [model val]
  {assoc model :uncommited-value val})

(defn commit-positive-integer [model]
  (let [{uncommited-value :uncommited-value} model
         ;;uncommited-value (js/.trim uncommited-value-raw)
        ]
    (cond  (not uncommited-value) {:model model}
           (re-matches #"^\-d+$" uncommited-value) {:model (assoc model :messages ["Value must be 0 or positive"])}
           (re-matches #"^\d+$" uncommited-value) {:model {}
                                                   :vallue-to-commit (js/parseInt uncommited-value)}
           :else {:model (assoc model :messages ["Please enter a valid integer"])})))

(test/deftest commit-positive-integer-test
  (test/is (= {:model {:messages ["aaa"]}}
              (commit-positive-integer {:messages ["aaa"]})))
  (test/is (= {:model {}
               :vallue-to-commit 123}
              (commit-positive-integer {:uncommited-value " 123 "})))
  (test/is (= {:model {:uncommited-value " -123 "
                       :messages ["Value must be 0 or positive"]}}
              (commit-positive-integer {:uncommited-value "abc"})))
  (test/is (= {:model {:uncommited-value "abc"
                       :messages ["Please enter a valid integer"]}}
              (commit-positive-integer {:uncommited-value "abc"}))))