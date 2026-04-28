/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "@/src/components/layout/Layout";
import Dashboard from "@/src/pages/Dashboard";
import UserList from "@/src/pages/UserList";
import WordCloud from "@/src/pages/WordCloud";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/word-cloud" element={<WordCloud />} />
          <Route path="/users" element={<UserList />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

