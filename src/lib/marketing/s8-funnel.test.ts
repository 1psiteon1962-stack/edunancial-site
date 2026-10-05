import test from "node:test";import assert from "node:assert/strict";import { diagnoseFunnel } from "./s8-funnel";

test("S8 refuses premature diagnosis",()=>assert.equal(diagnoseFunnel({impression:50}).stage,"insufficient_data"));
test("S8 diagnoses targeting leak",()=>assert.equal(diagnoseFunnel({impression:1000,engagement:5}).stage,"targeting"));
test("S8 diagnoses message leak",()=>assert.equal(diagnoseFunnel({impression:1000,engagement:100,click:2}).stage,"message"));
test("S8 diagnoses handoff leak",()=>assert.equal(diagnoseFunnel({impression:1000,engagement:100,click:20,lead:20,registration:2}).stage,"handoff"));
test("S8 diagnoses conversion leak",()=>assert.equal(diagnoseFunnel({impression:1000,engagement:100,click:20,lead:20,registration:10,paid_conversion:0}).stage,"conversion"));
test("S8 diagnoses retention leak",()=>assert.equal(diagnoseFunnel({impression:1000,engagement:100,click:20,lead:20,registration:10,paid_conversion:10,retained:3}).stage,"retention"));
test("S8 recognizes healthy funnel",()=>assert.equal(diagnoseFunnel({impression:1000,engagement:100,click:20,lead:20,registration:10,paid_conversion:10,retained:8}).stage,"healthy"));
