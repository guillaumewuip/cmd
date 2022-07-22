type CmdPost { // ie domain-post +
  content: () => Promise<React.ComponentType<{}>>
}

export {
  post: {
    cmd: {
      last: () => CmdPost
      all,

    }
  }
}
